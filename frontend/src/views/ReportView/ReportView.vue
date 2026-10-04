<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useReport } from '../../composables/useReport';
import { PRIORITY_COLORS } from '../../lib/priority';

const { report, loading, fetchReport } = useReport();
const { t } = useI18n();

onMounted(fetchReport);

const priorityConfig = computed(() => ({
  alta: { label: t('priorities.alta'), color: PRIORITY_COLORS.alta },
  media: { label: t('priorities.media'), color: PRIORITY_COLORS.media },
  baixa: { label: t('priorities.baixa'), color: PRIORITY_COLORS.baixa },
}));

const maxStatusCount = computed(() => {
  if (!report.value?.byStatus.length) return 1;
  return Math.max(...report.value.byStatus.map((s) => s.count), 1);
});

const maxPriorityCount = computed(() => {
  if (!report.value?.byPriority.length) return 1;
  return Math.max(...report.value.byPriority.map((p) => p.count), 1);
});

// Presentation only: bars rendered as a 10-cell grid
const CHART_CELLS = 10;
function chartCells(count: number, max: number) {
  const filled = Math.round((count / max) * CHART_CELLS);
  return Array.from({ length: CHART_CELLS }, (_, i) => i < filled);
}

// Progress ring (r = 36)
const RING_CIRCUMFERENCE = 2 * Math.PI * 36;
const ringDash = computed(() => {
  const pct = Math.min(Math.max(report.value?.kpis.donePct ?? 0, 0), 100);
  return `${(pct / 100) * RING_CIRCUMFERENCE} ${RING_CIRCUMFERENCE}`;
});
</script>

<template>
  <div class="report-view">
    <div v-if="loading" class="report-view__loading">
      <q-spinner class="report-view__spinner" size="40px" />
    </div>

    <template v-else-if="report">
      <div class="report-view__kpis">
        <div class="kpi-cell kpi-cell--ring">
          <div class="kpi-ring">
            <svg viewBox="0 0 80 80" width="80" height="80" aria-hidden="true">
              <circle class="kpi-ring__track" cx="40" cy="40" r="36" />
              <circle
                class="kpi-ring__fill"
                cx="40"
                cy="40"
                r="36"
                :stroke-dasharray="ringDash"
              />
            </svg>
            <span class="kpi-ring__value">{{ report.kpis.donePct }}%</span>
          </div>
          <span class="kpi-cell__label">{{
            t('tasks.progressLabel', {
              done: report.kpis.doneCount,
              total: report.kpis.total,
            })
          }}</span>
        </div>
        <div class="kpi-cell">
          <span class="kpi-cell__value">{{ report.kpis.total }}</span>
          <span class="kpi-cell__label">{{ t('report.kpiTotal') }}</span>
        </div>
        <div class="kpi-cell">
          <span class="kpi-cell__value kpi-cell__value--accent">{{
            report.kpis.doneCount
          }}</span>
          <span class="kpi-cell__label">{{ t('report.kpiDone') }}</span>
        </div>
        <div class="kpi-cell">
          <span class="kpi-cell__value">{{ report.kpis.openCount }}</span>
          <span class="kpi-cell__label">{{ t('report.kpiOpen') }}</span>
        </div>
        <div class="kpi-cell">
          <span class="kpi-cell__value kpi-cell__value--high">{{
            report.kpis.highCount
          }}</span>
          <span class="kpi-cell__label">{{ t('report.kpiHighPriority') }}</span>
        </div>
        <div class="kpi-cell">
          <span class="kpi-cell__value">{{ report.kpis.doneToday }}</span>
          <span class="kpi-cell__label">{{ t('report.kpiDoneToday') }}</span>
        </div>
      </div>

      <div class="report-view__charts">
        <div class="chart-card">
          <h3 class="chart-card__title">{{ t('report.statusTitle') }}</h3>
          <p class="chart-card__subtitle">{{ t('report.statusSubtitle') }}</p>
          <div class="chart-card__bars">
            <div v-for="s in report.byStatus" :key="s.id" class="chart-bar">
              <div class="chart-bar__label-row">
                <div class="chart-bar__dot" :style="{ background: s.color }" />
                <span class="chart-bar__label">{{ s.title }}</span>
                <span class="chart-bar__count">{{ s.count }}</span>
              </div>
              <div class="chart-bar__cells">
                <span
                  v-for="(filled, i) in chartCells(s.count, maxStatusCount)"
                  :key="i"
                  class="chart-bar__cell"
                  :style="filled ? { background: s.color } : {}"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="chart-card">
          <h3 class="chart-card__title">{{ t('report.priorityTitle') }}</h3>
          <p class="chart-card__subtitle">{{ t('report.prioritySubtitle') }}</p>
          <div class="chart-card__bars">
            <div
              v-for="p in report.byPriority"
              :key="p.priority"
              class="chart-bar"
            >
              <div class="chart-bar__label-row">
                <div
                  class="chart-bar__dot chart-bar__dot--round"
                  :style="{ background: priorityConfig[p.priority].color }"
                />
                <span class="chart-bar__label">{{
                  priorityConfig[p.priority].label
                }}</span>
                <span class="chart-bar__count">{{ p.count }}</span>
              </div>
              <div class="chart-bar__cells">
                <span
                  v-for="(filled, i) in chartCells(p.count, maxPriorityCount)"
                  :key="i"
                  class="chart-bar__cell"
                  :style="
                    filled
                      ? { background: priorityConfig[p.priority].color }
                      : {}
                  "
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="chart-card chart-card--tags">
        <h3 class="chart-card__title">{{ t('report.tagTitle') }}</h3>
        <p class="chart-card__subtitle">{{ t('report.tagSubtitle') }}</p>
        <div class="chart-card__tags">
          <span v-for="tag in report.byTag" :key="tag.label" class="tag-chip">
            #{{ tag.label }}
            <span class="tag-chip__count">{{ tag.count }}</span>
          </span>
          <p v-if="!report.byTag.length" class="chart-card__empty">
            {{ t('report.tagEmpty') }}
          </p>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.report-view {
  padding: 24px 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  &__loading {
    display: flex;
    justify-content: center;
    padding: 60px;
  }

  &__spinner {
    color: var(--muted);
  }

  &__kpis {
    display: grid;
    grid-template-columns: auto repeat(5, 1fr);
    /* 1px gaps over a line-colored background draw the cell dividers */
    gap: 1px;
    background: var(--line);
    border: 1px solid var(--line);
    border-radius: var(--radius-modal);
    overflow: hidden;
  }

  &__charts {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  @media (max-width: 1024px) {
    &__kpis {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  @media (max-width: 768px) {
    padding: 16px 12px;
    gap: 12px;

    &__kpis {
      grid-template-columns: repeat(2, 1fr);
    }

    &__charts {
      grid-template-columns: 1fr;
    }
  }
}

.kpi-cell {
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 8px;
  min-width: 0;
  background: var(--surface);

  &--ring {
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 16px;
  }

  @media (max-width: 768px) {
    &--ring {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
    }
  }

  &__value {
    font-family: var(--font-mono);
    font-size: 30px;
    font-weight: 600;
    color: var(--text);
    line-height: 1;

    &--accent {
      color: var(--accent);
    }

    &--high {
      color: var(--prio-alta);
    }
  }

  &__label {
    font-family: var(--font-mono);
    font-size: 11.5px;
    color: var(--muted);
  }
}

.kpi-ring {
  position: relative;
  width: 80px;
  height: 80px;
  flex-shrink: 0;

  svg {
    display: block;
    transform: rotate(-90deg);
  }

  circle {
    fill: none;
    stroke-width: 6;
  }

  &__track {
    stroke: var(--line);
  }

  &__fill {
    stroke: var(--accent);
    transition: stroke-dasharray 0.5s ease;
  }

  &__value {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-mono);
    font-size: 16px;
    font-weight: 600;
    color: var(--text);
  }
}

.chart-card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-modal);
  padding: 20px;

  &--tags {
    grid-column: 1 / -1;

    @media (max-width: 768px) {
      grid-column: auto;
    }
  }

  &__title {
    font-family: var(--font-mono);
    font-size: 14px;
    font-weight: 600;
    color: var(--text);
    line-height: 1.3;
    margin: 0 0 4px;
  }

  &__subtitle {
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--muted);
    margin: 0 0 20px;
  }

  &__bars {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  &__empty {
    font-family: var(--font-mono);
    font-size: 12.5px;
    color: var(--muted);
    margin: 0;
  }
}

.chart-bar {
  display: flex;
  flex-direction: column;
  gap: 8px;

  &__label-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__dot {
    width: 8px;
    height: 8px;
    border-radius: 2px;
    flex-shrink: 0;

    &--round {
      width: 6px;
      height: 6px;
      border-radius: 50%;
    }
  }

  &__label {
    flex: 1;
    font-family: var(--font-mono);
    font-size: 12.5px;
    color: var(--text-2);
  }

  &__count {
    font-family: var(--font-mono);
    font-size: 12.5px;
    font-weight: 600;
    color: var(--text);
  }

  &__cells {
    display: grid;
    grid-template-columns: repeat(10, 1fr);
    gap: 3px;
  }

  &__cell {
    height: 16px;
    border-radius: 3px;
    background: var(--line-soft);
    transition: background 0.3s;
  }
}

.tag-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 32px;
  padding: 0 12px;
  border: 1px solid var(--line-strong);
  border-radius: var(--radius);
  font-family: var(--font-mono);
  font-size: 12.5px;
  font-weight: 500;
  color: var(--text-2);

  &__count {
    color: var(--muted);
  }
}
</style>
