import { ref, computed, watch, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import type { Task, Status } from '../../../types';

interface TaskModalProps {
  modelValue: boolean;
  statuses: Status[];
  task?: Task | null;
  defaultStatusId?: string;
}

interface SaveData {
  title: string;
  statusId: string;
  priority: string;
  tags: string[];
  dueDate: string | null;
  description: string | null;
}

interface TaskModalEmit {
  (evt: 'update:modelValue', value: boolean): void;
  (evt: 'save', data: SaveData): void;
  (evt: 'delete', task: Task): void;
}

export function useTaskModal(props: TaskModalProps, emit: TaskModalEmit) {
  const { t } = useI18n();

  const title = ref('');
  const description = ref('');
  const statusId = ref('');
  const priority = ref('media');
  const tagsInput = ref('');
  const dueDate = ref('');
  const isMobile = ref(false);

  const isEdit = computed(() => Boolean(props.task));

  const priorities = computed(() => [
    { value: 'alta', label: t('priorities.alta'), color: '#dd5a4b' },
    { value: 'media', label: t('priorities.media'), color: '#d99a2b' },
    { value: 'baixa', label: t('priorities.baixa'), color: '#6b9bd1' },
  ]);

  watch(
    () => props.modelValue,
    (open) => {
      if (!open) return;
      if (props.task) {
        title.value = props.task.title;
        description.value = props.task.description ?? '';
        statusId.value = props.task.statusId;
        priority.value = props.task.priority;
        tagsInput.value = props.task.tags.join(', ');
        dueDate.value = props.task.dueDate ?? '';
      } else {
        title.value = '';
        description.value = '';
        statusId.value = props.defaultStatusId ?? props.statuses[0]?.id ?? '';
        priority.value = 'media';
        tagsInput.value = '';
        dueDate.value = '';
      }
    },
  );

  onMounted(() => {
    isMobile.value = window.innerWidth <= 768;
  });

  function close() {
    emit('update:modelValue', false);
  }

  function handleSave() {
    if (!title.value.trim()) return;
    const tags = tagsInput.value
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const data: SaveData = {
      title: title.value.trim(),
      statusId: statusId.value,
      priority: priority.value,
      tags,
      dueDate: dueDate.value.trim() || null,
      description: description.value.trim() || null,
    };
    emit('save', data);
    close();
  }

  function handleDelete() {
    if (props.task) {
      emit('delete', props.task);
      close();
    }
  }

  return {
    t,
    title,
    description,
    statusId,
    priority,
    tagsInput,
    dueDate,
    isMobile,
    isEdit,
    priorities,
    close,
    handleSave,
    handleDelete,
  };
}
