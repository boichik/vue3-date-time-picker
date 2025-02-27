<template>
  <table class="docs-table">
    <thead>
      <tr>
        <th
          v-for="(col, key) in data.columns"
          class="docs-table__column"
          :key="key"
        >
          {{ t(col.label) }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(row, rowIndex) in data.rows"
        :key="rowIndex"
        class="docs-table__row"
      >
        <td
          v-for="(col, colKey) in data.columns"
          :key="`${rowIndex}-${colKey}`"
          :class="getClassElement(row[colKey])"
        >
          <div class="docs-table__row-cell__content">
            <div
              v-html="
                getSanitizedText(row[colKey].value, row[colKey].needTranslate)
              "
            ></div>

            <Badge
              v-if="row[colKey].version"
              type="tip"
              class="docs-table__row-cell__content__badge"
              :text="row[colKey].version"
            />

            <a v-if="row[colKey].link" :href="row[colKey].link?.href">
              {{ t(row[colKey].link?.text) }}
            </a>
            <Info v-if="row[colKey].infoPopover">
              <div
                v-html="
                  getSanitizedText(
                    row[colKey].infoPopover?.content,
                    row[colKey].infoPopover.needTranslate
                  )
                "
              ></div>
            </Info>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { sanitizeHtml } from '../../../../../src/utils/sanitizeHtml';
import type {
  DocsTableData,
  DocsTableRowElement,
} from '../../interfaces/DocsTable';
import { useLocalization } from '../../composables/useLocalization';

const { t } = useLocalization();

const props = defineProps<{ data: DocsTableData }>();

function getClassElement(el: DocsTableRowElement) {
  const classes = ['docs-table__row-cell'];

  if (el.infoPopover) {
    classes.push('docs-table__row-cell--flex');
  }

  if (el.version) {
    classes.push('docs-table__row-cell--version');
  }

  return classes;
}

function getSanitizedText(value: unknown, needTranslate?: boolean) {
  const sanitized = sanitizeHtml(value);

  return needTranslate ? t(sanitized || '') : sanitized;
}
</script>

<style lang="scss" scoped>
.docs-table {
  &__row-cell {
    position: relative;

    &--version {
      padding: 30px 16px 8px;
    }

    &--flex &__content {
      display: inline-flex;
      align-items: center;
      justify-content: flex-start;
    }

    &__content {
      &__badge {
        position: absolute;
        top: 9px;
        right: 4px;
      }
    }
  }
}
</style>
