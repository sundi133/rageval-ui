import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { usePathname, useRouter } from 'next/navigation';
import { useTransition } from 'react';

export default function Search({ disabled }: { disabled?: boolean }) {
  const { replace } = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function handleSearch(term: string) {
    const params = new URLSearchParams(window.location.search);
    if (term) {
      params.set('q', term);
    } else {
      params.delete('q');
    }

    startTransition(() => {
      replace(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <div></div>
  );
}
