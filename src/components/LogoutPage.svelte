<script lang="ts">
  import { onMount } from 'svelte';
  import { Button } from '$lib/components/ui/button';

  let loading = true;
  let error = '';

  onMount(async () => {
    try {
      const res = await fetch('/api/logout', { method: 'POST' });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        error = data?.message || 'Logout gagal';
        loading = false;
        return;
      }

      window.location.href = '/auth/login';
    } catch (e) {
      error = 'Tidak bisa logout saat ini.';
      loading = false;
    }
  });
</script>

<div class="min-h-screen flex items-center justify-center px-4 py-10">
  <div class="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
    <h1 class="text-2xl font-semibold mb-4">Logout</h1>

    {#if loading}
      <p class="text-base text-slate-600">Memproses logout...</p>
    {:else}
      <p class="mb-4 text-sm text-destructive">{error}</p>
      <Button onclick={() => (window.location.href = '/auth/login')}>
        Kembali ke Login
      </Button>
    {/if}
  </div>
</div>
