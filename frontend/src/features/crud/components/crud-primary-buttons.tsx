import { Button } from '@/components/ui/button';
import { useNavigate, useParams } from '@tanstack/react-router';
import { ArrowLeftIcon, CirclePlusIcon } from 'lucide-react';

export function CrudPrimaryButtons(config: any) {
  const params = useParams({ strict: false });
  const { crud } = params;
  const navigate = useNavigate();

  console.log({ params });

  return (
    <div className='flex gap-2'>
      <Button
        effect="gooeyLeft"
        icon={ArrowLeftIcon}
        iconPlacement="left"
        onClick={() => navigate({ to: `/general/${crud}` })}
      >
        Back
      </Button>
      {!window.location.href.includes("/add") && (
        <Button
          effect="gooeyRight"
          icon={CirclePlusIcon}
          iconPlacement="right"
          onClick={() => navigate({ to: `/general/${crud}/add` })}
        >
          <span className='capitalize'>Add {config.singularName}</span>
        </Button>
      )}
    </div>
  );
}
