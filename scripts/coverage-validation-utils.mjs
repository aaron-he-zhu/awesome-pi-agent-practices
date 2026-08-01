const ACTIVE_REVIEW_STATUSES = new Set(["source-reviewed", "hands-on-verified"]);

function duplicates(values) {
  const seen = new Set();
  const repeated = new Set();
  for (const value of values) {
    if (seen.has(value)) repeated.add(value);
    seen.add(value);
  }
  return [...repeated];
}

function isActiveReviewedResource(resource) {
  return (
    resource.kind === "community" &&
    resource.currentScope === true &&
    ACTIVE_REVIEW_STATUSES.has(resource.reviewStatus) &&
    (resource.status === "featured" || resource.status.startsWith("watchlist"))
  );
}

function hasCategory(record, categoryId) {
  return (
    record.primaryCategory === categoryId ||
    (record.secondaryCategories ?? []).includes(categoryId)
  );
}

export function validateTaxonomyAssignments(taxonomy, registry, candidateRegistry) {
  const failures = [];
  const categoryIds = taxonomy.categories.map((category) => category.id);
  const architectureIds = taxonomy.architectures.map((architecture) => architecture.id);
  const relationIds = taxonomy.relations.map((relation) => relation.id);
  const categorySet = new Set(categoryIds);
  const architectureSet = new Set(architectureIds);
  const relationSet = new Set(relationIds);

  for (const duplicate of duplicates(categoryIds)) {
    failures.push(`taxonomy: duplicate category id ${duplicate}`);
  }
  for (const duplicate of duplicates(architectureIds)) {
    failures.push(`taxonomy: duplicate architecture id ${duplicate}`);
  }
  for (const duplicate of duplicates(relationIds)) {
    failures.push(`taxonomy: duplicate relation id ${duplicate}`);
  }

  const validateRecord = (record, label) => {
    if (!categorySet.has(record.primaryCategory)) {
      failures.push(`${label}: unknown primary category ${record.primaryCategory}`);
    }

    const secondaryCategories = record.secondaryCategories ?? [];
    if (secondaryCategories.includes(record.primaryCategory)) {
      failures.push(`${label}: primary category is repeated in secondaryCategories`);
    }
    for (const category of secondaryCategories) {
      if (!categorySet.has(category)) failures.push(`${label}: unknown secondary category ${category}`);
    }

    const architectures = record.architectureTypes ?? [];
    if (architectures.length === 0) failures.push(`${label}: architectureTypes must not be empty`);
    for (const architecture of architectures) {
      if (!architectureSet.has(architecture)) {
        failures.push(`${label}: unknown architecture type ${architecture}`);
      }
    }

    const relations = record.relationTypes ?? [];
    if (relations.length === 0) failures.push(`${label}: relationTypes must not be empty`);
    for (const relation of relations) {
      if (!relationSet.has(relation)) failures.push(`${label}: unknown relation type ${relation}`);
    }
  };

  for (const resource of registry.resources.filter((item) => item.kind === "community")) {
    validateRecord(resource, `resource ${resource.id}`);
  }
  for (const candidate of candidateRegistry.candidates) {
    validateRecord(candidate, `candidate ${candidate.id}`);
  }

  return failures;
}

export function buildCoverageSummary(taxonomy, registry, candidateRegistry) {
  const communityResources = registry.resources.filter((resource) => resource.kind === "community");
  const reviewedResources = communityResources.filter(isActiveReviewedResource);
  const handsOnResources = reviewedResources.filter(
    (resource) => resource.reviewStatus === "hands-on-verified",
  );
  const inactiveResources = communityResources.filter(
    (resource) => !isActiveReviewedResource(resource),
  );
  const deferredResources = inactiveResources.filter((resource) => resource.status === "deferred");
  const rejectedResources = inactiveResources.filter((resource) => resource.status === "rejected");
  const staleResources = inactiveResources.filter((resource) => resource.status === "stale");
  const otherInactiveResources = inactiveResources.filter(
    (resource) => !["deferred", "rejected", "stale"].includes(resource.status),
  );
  const activeCandidates = candidateRegistry.candidates.filter(
    (candidate) => !["rejected", "promoted-to-resource"].includes(candidate.disposition),
  );
  const rejectedCandidates = candidateRegistry.candidates.filter(
    (candidate) => candidate.disposition === "rejected",
  );
  const unpromotedCandidates = [...activeCandidates, ...rejectedCandidates];

  const categories = taxonomy.categories.map((category) => {
    const sourceReviewedPrimary = reviewedResources.filter(
      (resource) => resource.primaryCategory === category.id,
    );
    const handsOnPrimary = handsOnResources.filter(
      (resource) => resource.primaryCategory === category.id,
    );
    const deferredPrimary = deferredResources.filter(
      (resource) => resource.primaryCategory === category.id,
    );
    const candidatesPrimary = activeCandidates.filter(
      (candidate) => candidate.primaryCategory === category.id,
    );
    const sourceReviewedAny = reviewedResources.filter((resource) => hasCategory(resource, category.id));
    const handsOnAny = handsOnResources.filter((resource) => hasCategory(resource, category.id));
    const deferredAny = deferredResources.filter((resource) => hasCategory(resource, category.id));
    const rejectedResourceAny = rejectedResources.filter((resource) =>
      hasCategory(resource, category.id),
    );
    const staleResourceAny = staleResources.filter((resource) => hasCategory(resource, category.id));
    const otherInactiveAny = otherInactiveResources.filter((resource) =>
      hasCategory(resource, category.id),
    );
    const candidatesAny = activeCandidates.filter((candidate) => hasCategory(candidate, category.id));
    const rejectedAny = rejectedCandidates.filter((candidate) => hasCategory(candidate, category.id));

    return {
      id: category.id,
      name: category.name,
      sourceReviewedPrimary: sourceReviewedPrimary.length,
      handsOnPrimary: handsOnPrimary.length,
      deferredPrimary: deferredPrimary.length,
      discoveryCandidatesPrimary: candidatesPrimary.length,
      sourceReviewedAny: sourceReviewedAny.length,
      handsOnAny: handsOnAny.length,
      deferredAny: deferredAny.length,
      rejectedResourcesAny: rejectedResourceAny.length,
      staleResourcesAny: staleResourceAny.length,
      otherInactiveResourcesAny: otherInactiveAny.length,
      discoveryCandidatesAny: candidatesAny.length,
      rejectedCandidatesAny: rejectedAny.length,
      sourceReviewedPrimaryResourceIds: sourceReviewedPrimary.map((resource) => resource.id).sort(),
      discoveryCandidatePrimaryIds: candidatesPrimary.map((candidate) => candidate.id).sort(),
      sourceReviewedResourceIds: sourceReviewedAny.map((resource) => resource.id).sort(),
      handsOnResourceIds: handsOnAny.map((resource) => resource.id).sort(),
      deferredResourceIds: deferredAny.map((resource) => resource.id).sort(),
      rejectedResourceIds: rejectedResourceAny.map((resource) => resource.id).sort(),
      staleResourceIds: staleResourceAny.map((resource) => resource.id).sort(),
      otherInactiveResourceIds: otherInactiveAny.map((resource) => resource.id).sort(),
      discoveryCandidateIds: candidatesAny.map((candidate) => candidate.id).sort(),
      rejectedCandidateIds: rejectedAny.map((candidate) => candidate.id).sort(),
      sourceArchitectureTypes: [
        ...new Set(sourceReviewedAny.flatMap((resource) => resource.architectureTypes)),
      ].sort(),
      candidateArchitectureTypes: [
        ...new Set(candidatesAny.flatMap((candidate) => candidate.architectureTypes)),
      ].sort(),
    };
  });

  const categoryArchitectureCells = taxonomy.categories.flatMap((category) =>
    taxonomy.architectures.map((architecture) => {
      const matchesCell = (record) =>
        hasCategory(record, category.id) && record.architectureTypes.includes(architecture.id);
      const sourceReviewed = reviewedResources.filter(matchesCell);
      const handsOn = handsOnResources.filter(matchesCell);
      const deferred = deferredResources.filter(matchesCell);
      const rejectedResourceRecords = rejectedResources.filter(matchesCell);
      const stale = staleResources.filter(matchesCell);
      const otherInactive = otherInactiveResources.filter(matchesCell);
      const unresolved = activeCandidates.filter(matchesCell);
      const rejected = rejectedCandidates.filter(matchesCell);
      const candidates = unpromotedCandidates.filter(matchesCell);
      return {
        id: `${category.id}::${architecture.id}`,
        categoryId: category.id,
        architectureId: architecture.id,
        sourceReviewedRecords: sourceReviewed.length,
        handsOnRecords: handsOn.length,
        deferredRecords: deferred.length,
        rejectedResourceRecords: rejectedResourceRecords.length,
        staleResourceRecords: stale.length,
        otherInactiveResourceRecords: otherInactive.length,
        candidateRecords: candidates.length,
        unresolvedCandidates: unresolved.length,
        rejectedCandidates: rejected.length,
        sourceReviewedResourceIds: sourceReviewed.map((record) => record.id).sort(),
        handsOnResourceIds: handsOn.map((record) => record.id).sort(),
        deferredResourceIds: deferred.map((record) => record.id).sort(),
        rejectedResourceIds: rejectedResourceRecords.map((record) => record.id).sort(),
        staleResourceIds: stale.map((record) => record.id).sort(),
        otherInactiveResourceIds: otherInactive.map((record) => record.id).sort(),
        unresolvedCandidateIds: unresolved.map((record) => record.id).sort(),
        rejectedCandidateIds: rejected.map((record) => record.id).sort(),
      };
    }),
  );

  const architectures = taxonomy.architectures.map((architecture) => ({
    id: architecture.id,
    name: architecture.name,
    sourceReviewedRecords: reviewedResources.filter((resource) =>
      resource.architectureTypes.includes(architecture.id),
    ).length,
    discoveryCandidates: activeCandidates.filter((candidate) =>
      candidate.architectureTypes.includes(architecture.id),
    ).length,
  }));

  const relations = taxonomy.relations.map((relation) => ({
    id: relation.id,
    name: relation.name,
    sourceReviewedRecords: reviewedResources.filter((resource) =>
      resource.relationTypes.includes(relation.id),
    ).length,
    discoveryCandidates: activeCandidates.filter((candidate) =>
      candidate.relationTypes.includes(relation.id),
    ).length,
  }));

  return {
    schemaVersion: 2,
    generatedFrom: {
      resourceRegistrySnapshotAt: registry.snapshotAt,
      discoveryRegistrySnapshotAt: candidateRegistry.snapshotAt,
      taxonomySchemaVersion: taxonomy.schemaVersion,
    },
    totals: {
      categories: categories.length,
      registeredCommunityRecords: communityResources.length,
      sourceReviewedPrimaryRecords: reviewedResources.length,
      handsOnPrimaryRecords: handsOnResources.length,
      discoveryCandidates: activeCandidates.length,
      sourceReviewedGapCategories: categories.filter(
        (category) => category.sourceReviewedAny === 0,
      ).length,
      handsOnGapCategories: categories.filter((category) => category.handsOnAny === 0).length,
      sourceGapCategoriesWithCandidates: categories.filter(
        (category) =>
          category.sourceReviewedAny === 0 && category.discoveryCandidatesAny > 0,
      ).length,
      sourceReviewedPrimaryGapCategories: categories.filter(
        (category) => category.sourceReviewedPrimary === 0,
      ).length,
      handsOnPrimaryGapCategories: categories.filter(
        (category) => category.handsOnPrimary === 0,
      ).length,
      categoryArchitectureCells: categoryArchitectureCells.length,
      nonemptyCategoryArchitectureCells: categoryArchitectureCells.filter(
        (cell) =>
          cell.sourceReviewedRecords +
            cell.deferredRecords +
            cell.rejectedResourceRecords +
            cell.staleResourceRecords +
            cell.otherInactiveResourceRecords +
            cell.unresolvedCandidates +
            cell.rejectedCandidates >
          0,
      ).length,
      sourceReviewedCategoryArchitectureCells: categoryArchitectureCells.filter(
        (cell) => cell.sourceReviewedRecords > 0,
      ).length,
      handsOnCategoryArchitectureCells: categoryArchitectureCells.filter(
        (cell) => cell.handsOnRecords > 0,
      ).length,
    },
    categories,
    categoryArchitectureCells,
    architectures,
    relations,
  };
}

export function validateCoverageMatrixCounts(markdown, summary, locale) {
  const failures = [];
  const startMarker = "<!-- sync:coverage-community -->";
  const endMarker = "<!-- sync:coverage-gaps -->";
  const start = markdown.indexOf(startMarker);
  const end = markdown.indexOf(endMarker, start + startMarker.length);
  if (start === -1 || end === -1) {
    return [`coverage matrix ${locale}: missing community or priority sync marker`];
  }

  const tableRows = markdown
    .slice(start + startMarker.length, end)
    .split("\n")
    .filter((line) => /^\|/u.test(line))
    .map((line) => line.split("|").slice(1, -1).map((cell) => cell.trim()))
    .filter((cells) => cells.length >= 4 && !/^Capability$/iu.test(cells[0]))
    .filter((cells) => !/^[-: ]+$/u.test(cells[0]));

  if (tableRows.length !== summary.categories.length) {
    failures.push(
      `coverage matrix ${locale}: expected ${summary.categories.length} category rows, found ${tableRows.length}`,
    );
    return failures;
  }

  for (const [index, category] of summary.categories.entries()) {
    const row = tableRows[index];
    const expectedName = category.name[locale];
    if (row[0] !== expectedName) {
      failures.push(
        `coverage matrix ${locale}: row ${index + 1} is ${row[0]}, expected ${expectedName}`,
      );
    }
    const countPattern = locale === "zh-CN" ? /(\d+)\s*条\s*Source-reviewed/iu : /(\d+)\s+source-reviewed/iu;
    const match = row[3].match(countPattern);
    if (!match) {
      failures.push(
        `coverage matrix ${locale}: ${row[0]} does not state a machine-checkable source-reviewed count`,
      );
      continue;
    }
    const stated = Number.parseInt(match[1], 10);
    if (stated !== category.sourceReviewedPrimary) {
      failures.push(
        `coverage matrix ${locale}: ${row[0]} states ${stated} source-reviewed, expected ${category.sourceReviewedPrimary}`,
      );
    }
  }

  return failures;
}

export function validateTaxonomyDocumentation(taxonomy, documents) {
  const failures = [];
  for (const relation of taxonomy.relations) {
    for (const [label, text] of [
      ["English discovery protocol", documents.protocolEnglish],
      ["Chinese discovery protocol", documents.protocolChinese],
      ["candidate issue form", documents.candidateIssueForm],
    ]) {
      if (!text.includes(relation.id)) {
        failures.push(`${label}: missing relation taxonomy id ${relation.id}`);
      }
    }
  }
  for (const architecture of taxonomy.architectures) {
    for (const [label, text] of [
      ["English discovery protocol", documents.protocolEnglish],
      ["Chinese discovery protocol", documents.protocolChinese],
    ]) {
      if (!text.includes(architecture.id)) {
        failures.push(`${label}: missing architecture taxonomy id ${architecture.id}`);
      }
    }
  }
  return failures;
}

function list(values) {
  return values.length === 0 ? "—" : values.map((value) => `\`${value}\``).join(", ");
}

function statusFor(category, locale) {
  const sourceGap = category.sourceReviewedAny === 0;
  const handsOnGap = category.handsOnAny === 0;
  if (locale === "zh-CN") {
    if (sourceGap && category.discoveryCandidatesAny > 0) return "源码缺口；已有候选";
    if (sourceGap) return "源码缺口；无已登记候选";
    if (handsOnGap) return "已有源码证据；亲测缺口";
    return "已有源码与亲测证据";
  }
  if (sourceGap && category.discoveryCandidatesAny > 0) {
    return "Source gap; candidates registered";
  }
  if (sourceGap) return "Source gap; no registered candidate";
  if (handsOnGap) return "Source evidence; hands-on gap";
  return "Source and hands-on evidence";
}

export function renderCoverageMarkdown(summary, locale) {
  const chinese = locale === "zh-CN";
  const peerLine = chinese
    ? "[English](./coverage-summary.md) | [简体中文](./coverage-summary.zh-CN.md)"
    : "[English](./coverage-summary.md) | [简体中文](./coverage-summary.zh-CN.md)";
  const title = chinese ? "# 机器生成的生态覆盖摘要" : "# Machine-generated Ecosystem Coverage Summary";
  const notice = chinese
    ? "本文件由 `npm run generate:coverage` 生成，请勿手工修改。候选只是待审查线索，不代表推荐、兼容性或安全背书。"
    : "This file is generated by `npm run generate:coverage`; do not edit it by hand. Candidates are review leads, not recommendations or claims of compatibility or safety.";
  const totals = chinese
    ? `当前机器数据包含 **${summary.totals.categories}** 个类别、**${summary.totals.registeredCommunityRecords}** 条已注册社区记录和 **${summary.totals.discoveryCandidates}** 条活跃发现候选。按 Primary 与 Secondary Category 的全部分配计算，**${summary.totals.sourceReviewedGapCategories}** 类没有 Source-reviewed 代表，**${summary.totals.handsOnGapCategories}** 类没有 Hands-on-verified 代表；其中 **${summary.totals.sourceGapCategoriesWithCandidates}** 个源码缺口类别已有候选。若只看互斥 Primary Placement，源码与亲测缺口分别为 **${summary.totals.sourceReviewedPrimaryGapCategories}** 与 **${summary.totals.handsOnPrimaryGapCategories}** 类。机器 JSON 还完整报告 **${summary.totals.categoryArchitectureCells}** 个 Category × Architecture Cell，其中 **${summary.totals.nonemptyCategoryArchitectureCells}** 个非空。`
    : `The machine data contains **${summary.totals.categories}** categories, **${summary.totals.registeredCommunityRecords}** registered community records, and **${summary.totals.discoveryCandidates}** active discovery candidates. Across all primary and secondary category assignments, **${summary.totals.sourceReviewedGapCategories}** categories have no source-reviewed representative and **${summary.totals.handsOnGapCategories}** have no hands-on-verified representative; **${summary.totals.sourceGapCategoriesWithCandidates}** source gaps already have candidates. Looking only at mutually exclusive primary placement, the source and hands-on gaps are **${summary.totals.sourceReviewedPrimaryGapCategories}** and **${summary.totals.handsOnPrimaryGapCategories}** categories. The machine JSON reports all **${summary.totals.categoryArchitectureCells}** category × architecture cells, of which **${summary.totals.nonemptyCategoryArchitectureCells}** are nonempty.`;
  const sources = chinese
    ? "数据源：[正式资源注册表](../../data/resources.json)、[发现候选注册表](../../data/discovery-candidates.json)与[实践分类法](../../data/practice-taxonomy.json)。正式矩阵中的边界、风险和研究动作仍见[生态覆盖矩阵](./coverage-matrix.zh-CN.md)。"
    : "Sources: the [reviewed resource registry](../../data/resources.json), [discovery candidate registry](../../data/discovery-candidates.json), and [practice taxonomy](../../data/practice-taxonomy.json). Boundary, risk, and research-action analysis remains in the [ecosystem coverage matrix](./coverage-matrix.md).";
  const categoryHeading = chinese ? "## 类别覆盖" : "## Category coverage";
  const categoryHeader = chinese
    ? "| 类别 | 源码审查全部 / Primary | 人类亲测全部 / Primary | Deferred 全部 / Primary | Rejected / Stale Resource | 发现候选全部 / Primary | 源码架构 | 候选架构 | 状态 |\n| --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |"
    : "| Category | Source-reviewed any / primary | Hands-on any / primary | Deferred any / primary | Rejected / stale resources | Discovery candidates any / primary | Source architectures | Candidate architectures | State |\n| --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |";
  const categoryRows = summary.categories.map(
    (category) =>
      `| ${category.name[locale]} (\`${category.id}\`) | ${category.sourceReviewedAny} / ${category.sourceReviewedPrimary} | ${category.handsOnAny} / ${category.handsOnPrimary} | ${category.deferredAny} / ${category.deferredPrimary} | ${category.rejectedResourcesAny} / ${category.staleResourcesAny} | ${category.discoveryCandidatesAny} / ${category.discoveryCandidatesPrimary} | ${list(category.sourceArchitectureTypes)} | ${list(category.candidateArchitectureTypes)} | ${statusFor(category, locale)} |`,
  );
  const cellHeading = chinese ? "## 类别 × 架构单元格" : "## Category × architecture cells";
  const cellIntro = chinese
    ? `机器 JSON 保存全部 ${summary.totals.categoryArchitectureCells} 个单元格，包括零值。下表只展示非空单元格；Unresolved 与 Rejected Candidate 分列，绝不计入源码或亲测证据。`
    : `The machine JSON preserves all ${summary.totals.categoryArchitectureCells} cells, including zeroes. This table shows only nonempty cells; unresolved and rejected candidates remain separate and never increase source or hands-on evidence.`;
  const cellHeader = chinese
    ? "| 类别 | 架构 | 源码审查 | 人类亲测 | Deferred Resource | Rejected Resource | Stale Resource | 其他 Inactive | Unresolved Candidate | Rejected Candidate |\n| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |"
    : "| Category | Architecture | Source reviewed | Hands on | Deferred resources | Rejected resources | Stale resources | Other inactive | Unresolved candidates | Rejected candidates |\n| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |";
  const categoryById = new Map(summary.categories.map((category) => [category.id, category]));
  const architectureById = new Map(
    summary.architectures.map((architecture) => [architecture.id, architecture]),
  );
  const nonemptyCells = summary.categoryArchitectureCells.filter(
    (cell) =>
      cell.sourceReviewedRecords +
        cell.deferredRecords +
        cell.rejectedResourceRecords +
        cell.staleResourceRecords +
        cell.otherInactiveResourceRecords +
        cell.unresolvedCandidates +
        cell.rejectedCandidates >
      0,
  );
  const cellRows = nonemptyCells.map((cell) => {
    const category = categoryById.get(cell.categoryId);
    const architecture = architectureById.get(cell.architectureId);
    return `| ${category.name[locale]} (\`${cell.categoryId}\`) | ${architecture.name[locale]} (\`${cell.architectureId}\`) | ${cell.sourceReviewedRecords} | ${cell.handsOnRecords} | ${cell.deferredRecords} | ${cell.rejectedResourceRecords} | ${cell.staleResourceRecords} | ${cell.otherInactiveResourceRecords} | ${cell.unresolvedCandidates} | ${cell.rejectedCandidates} |`;
  });
  const architectureHeading = chinese ? "## 架构分层" : "## Architecture strata";
  const architectureIntro = chinese
    ? "同一能力类别中的不同架构会产生不同的权限、生命周期与兼容性边界；因此，一个项目不能自动代表整个类别。"
    : "Different architectures in one capability category create different authority, lifecycle, and compatibility boundaries; one project therefore cannot represent an entire category.";
  const architectureHeader = chinese
    ? "| 架构 | 源码审查记录 | 发现候选 |\n| --- | ---: | ---: |"
    : "| Architecture | Source-reviewed records | Discovery candidates |\n| --- | ---: | ---: |";
  const architectureRows = summary.architectures.map(
    (architecture) =>
      `| ${architecture.name[locale]} (\`${architecture.id}\`) | ${architecture.sourceReviewedRecords} | ${architecture.discoveryCandidates} |`,
  );
  const relationHeading = chinese ? "## 生态关系" : "## Ecosystem relationships";
  const relationIntro = chinese
    ? "关系描述项目如何与 Pi 相连，而不是质量、当前兼容性或推荐等级；历史关系不会因后续内部化或重命名而被覆盖。"
    : "Relationships describe how a project connects to Pi, not its quality, current compatibility, or recommendation level; later internalization or renaming does not erase historical relationships.";
  const relationHeader = chinese
    ? "| 关系 | 源码审查记录 | 发现候选 |\n| --- | ---: | ---: |"
    : "| Relationship | Source-reviewed records | Discovery candidates |\n| --- | ---: | ---: |";
  const relationRows = summary.relations.map(
    (relation) =>
      `| ${relation.name[locale]} (\`${relation.id}\`) | ${relation.sourceReviewedRecords} | ${relation.discoveryCandidates} |`,
  );

  return [
    peerLine,
    "",
    title,
    "",
    "<!-- sync:generated-coverage-purpose -->",
    "",
    notice,
    "",
    sources,
    "",
    "<!-- sync:generated-coverage-counts -->",
    "",
    totals,
    "",
    categoryHeading,
    "",
    "<!-- sync:generated-coverage-categories -->",
    "",
    categoryHeader,
    ...categoryRows,
    "",
    cellHeading,
    "",
    "<!-- sync:generated-coverage-cells -->",
    "",
    cellIntro,
    "",
    cellHeader,
    ...cellRows,
    "",
    architectureHeading,
    "",
    "<!-- sync:generated-coverage-architectures -->",
    "",
    architectureIntro,
    "",
    architectureHeader,
    ...architectureRows,
    "",
    relationHeading,
    "",
    "<!-- sync:generated-coverage-relations -->",
    "",
    relationIntro,
    "",
    relationHeader,
    ...relationRows,
    "",
  ].join("\n");
}

export function stableJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}
