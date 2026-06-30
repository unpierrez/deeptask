<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useReport } from '../../composables/useReport'

const { report, loading, fetchReport } = useReport()
const { t } = useI18n()

onMounted(fetchReport)

const priorityConfig = computed(() => ({
    alta: { label: t('priorities.alta'), color: '#dd5a4b' },
    media: { label: t('priorities.media'), color: '#d99a2b' },
    baixa: { label: t('priorities.baixa'), color: '#6b9bd1' },
}))

const maxStatusCount = computed(() => {
    if (!report.value?.byStatus.length) return 1
    return Math.max(...report.value.byStatus.map((s) => s.count), 1)
})

const maxPriorityCount = computed(() => {
    if (!report.value?.byPriority.length) return 1
    return Math.max(...report.value.byPriority.map((p) => p.count), 1)
})
</script>

<template>
    <div class="report-view">
        <div v-if="loading" class="report-view__loading">
            <q-spinner color="grey-5" size="40px" />
        </div>

        <template v-else-if="report">
            <div class="report-view__kpis">
                <div class="kpi-card">
                    <div class="kpi-card__icon kpi-card__icon--gray">
                        <q-icon name="format_list_bulleted" size="18px" />
                    </div>
                    <span class="kpi-card__value">{{ report.kpis.total }}</span>
                    <span class="kpi-card__label">{{ t('report.kpiTotal') }}</span>
                </div>
                <div class="kpi-card">
                    <div class="kpi-card__icon kpi-card__icon--green">
                        <q-icon name="check_circle" size="18px" />
                    </div>
                    <span class="kpi-card__value">{{ report.kpis.doneCount }}</span>
                    <span class="kpi-card__label">{{ t('report.kpiDone') }}</span>
                </div>
                <div class="kpi-card">
                    <div class="kpi-card__icon kpi-card__icon--blue">
                        <q-icon name="pending" size="18px" />
                    </div>
                    <span class="kpi-card__value">{{ report.kpis.openCount }}</span>
                    <span class="kpi-card__label">{{ t('report.kpiOpen') }}</span>
                </div>
                <div class="kpi-card">
                    <div class="kpi-card__icon kpi-card__icon--red">
                        <q-icon name="flag" size="18px" />
                    </div>
                    <span class="kpi-card__value">{{ report.kpis.highCount }}</span>
                    <span class="kpi-card__label">{{ t('report.kpiHighPriority') }}</span>
                </div>
                <div class="kpi-card">
                    <div class="kpi-card__icon kpi-card__icon--purple">
                        <q-icon name="today" size="18px" />
                    </div>
                    <span class="kpi-card__value">{{ report.kpis.doneToday }}</span>
                    <span class="kpi-card__label">{{ t('report.kpiDoneToday') }}</span>
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
                            <div class="chart-bar__track">
                                <div
                                    class="chart-bar__fill"
                                    :style="{
                                        width: (s.count / maxStatusCount * 100) + '%',
                                        background: s.color,
                                    }"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div class="chart-card">
                    <h3 class="chart-card__title">{{ t('report.priorityTitle') }}</h3>
                    <p class="chart-card__subtitle">{{ t('report.prioritySubtitle') }}</p>
                    <div class="chart-card__bars">
                        <div v-for="p in report.byPriority" :key="p.priority" class="chart-bar">
                            <div class="chart-bar__label-row">
                                <div class="chart-bar__dot" :style="{ background: priorityConfig[p.priority].color }" />
                                <span class="chart-bar__label">{{ priorityConfig[p.priority].label }}</span>
                                <span class="chart-bar__count">{{ p.count }}</span>
                            </div>
                            <div class="chart-bar__track">
                                <div
                                    class="chart-bar__fill"
                                    :style="{
                                        width: (p.count / maxPriorityCount * 100) + '%',
                                        background: priorityConfig[p.priority].color,
                                    }"
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
                    <span v-for="t in report.byTag" :key="t.label" class="tag-chip">
                        {{ t.label }}
                        <span class="tag-chip__count">{{ t.count }}</span>
                    </span>
                    <p v-if="!report.byTag.length" class="chart-card__empty">{{ t('report.tagEmpty') }}</p>
                </div>
            </div>
        </template>
    </div>
</template>

<style scoped lang="scss">
.report-view {
    padding: 24px 28px;
    display: flex;
    flex-direction: column;
    gap: 16px;

    &__loading {
        display: flex;
        justify-content: center;
        padding: 60px;
    }

    &__kpis {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 12px;
    }

    &__charts {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
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

.kpi-card {
    background: #ffffff;
    border: 1px solid #ebebec;
    border-radius: 14px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 8px;

    &__icon {
        width: 36px;
        height: 36px;
        border-radius: 9px;
        display: flex;
        align-items: center;
        justify-content: center;

        &--gray { background: #f0f1f3; color: #6b7280; }
        &--green { background: #ecfdf5; color: #4f9d6f; }
        &--blue { background: #eff6ff; color: #4f7bd9; }
        &--red { background: #fff5f5; color: #dd5a4b; }
        &--purple { background: #f3f0ff; color: #7c5cbf; }
    }

    &__value {
        font-size: 1.875rem;
        font-weight: 700;
        color: #141414;
        font-family: "Plus Jakarta Sans", system-ui, sans-serif;
        line-height: 1;
    }

    &__label {
        font-size: 0.8125rem;
        color: #9aa3af;
        font-family: "Plus Jakarta Sans", system-ui, sans-serif;
    }
}

.chart-card {
    background: #ffffff;
    border: 1px solid #ebebec;
    border-radius: 14px;
    padding: 20px;

    &--tags {
        grid-column: 1 / -1;

        @media (max-width: 768px) {
            grid-column: auto;
        }
    }

    &__title {
        font-size: 0.9375rem;
        font-weight: 700;
        color: #141414;
        margin: 0 0 2px;
        font-family: "Plus Jakarta Sans", system-ui, sans-serif;
    }

    &__subtitle {
        font-size: 0.8125rem;
        color: #9aa3af;
        margin: 0 0 16px;
        font-family: "Plus Jakarta Sans", system-ui, sans-serif;
    }

    &__bars {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    &__tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
    }

    &__empty {
        font-size: 0.875rem;
        color: #9aa3af;
        margin: 0;
        font-family: "Plus Jakarta Sans", system-ui, sans-serif;
    }
}

.chart-bar {
    display: flex;
    flex-direction: column;
    gap: 5px;

    &__label-row {
        display: flex;
        align-items: center;
        gap: 7px;
    }

    &__dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        flex-shrink: 0;
    }

    &__label {
        flex: 1;
        font-size: 0.875rem;
        color: #374151;
        font-family: "Plus Jakarta Sans", system-ui, sans-serif;
    }

    &__count {
        font-size: 0.875rem;
        font-weight: 600;
        color: #141414;
        font-family: "Plus Jakarta Sans", system-ui, sans-serif;
    }

    &__track {
        height: 7px;
        background: #f0f1f3;
        border-radius: 99px;
        overflow: hidden;
    }

    &__fill {
        height: 100%;
        border-radius: 99px;
        transition: width 0.5s ease;
    }
}

.tag-chip {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background: #f5f6f8;
    border: 1.5px solid #e5e7eb;
    border-radius: 99px;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
    font-family: "Plus Jakarta Sans", system-ui, sans-serif;

    &__count {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #141414;
        color: #ffffff;
        font-size: 0.6875rem;
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: "Plus Jakarta Sans", system-ui, sans-serif;
    }
}
</style>
