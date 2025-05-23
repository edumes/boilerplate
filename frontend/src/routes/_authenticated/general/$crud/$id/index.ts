import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/general/$crud/$id/')({
  beforeLoad: ({ params }) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(params.id)) {
      throw new Error('Invalid UUID format');
    }

    return {
      uuid: params.id,
      crud: params.crud
    };
  }
});
