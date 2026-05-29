<script lang="ts">
  import { onMount } from 'svelte';
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';

  interface User {
    id: string;
    email: string;
    [key: string]: unknown;
  }

  let user: User | null = $state(null);
  let loading = $state(true);
  let error = $state('');

  onMount(async () => {
    try {
      const res = await fetch('/api/me', {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });

      const data = await res.json();

      if (!res.ok) {
        error = data.message || 'Gagal mengambil data user';
        loading = false;
        return;
      }

      user = data.data || data;
    } catch (e) {
      error = 'Tidak bisa mengambil data user saat ini.';
    } finally {
      loading = false;
    }
  });

  function handleLogout() {
    window.location.href = '/auth/logout';
  }
</script>

<div class="min-h-screen flex items-center justify-center px-4 py-10">
  <Card.Root class="w-full max-w-md">
    <Card.Header>
      <Card.Title class="text-2xl">Profil User</Card.Title>
      <Card.Description>Informasi akun Anda</Card.Description>
    </Card.Header>

    <Card.Content>
      {#if loading}
        <p class="text-base text-slate-600">Memuat data...</p>
      {:else if error}
        <p class="text-sm text-destructive mb-4">{error}</p>
        <Button onclick={() => window.location.href = '/auth/login'}>Login</Button>
      {:else if user}
        <div class="space-y-4">
          <div>
            <label class="text-sm font-medium text-slate-600">ID</label>
            <p class="text-base">{user.id}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-slate-600">Email</label>
            <p class="text-base">{user.email}</p>
          </div>
          {#each Object.entries(user).filter(([key]) => !['id', 'email'].includes(key)) as [key, value]}
            <div>
              <label class="text-sm font-medium text-slate-600 capitalize">{key}</label>
              <p class="text-base">{typeof value === 'object' && value !== null ? JSON.stringify(value) : String(value)}</p>
            </div>
          {/each}
        </div>
        <Button class="mt-6 w-full" variant="outline" onclick={handleLogout}>Logout</Button>
      {/if}
    </Card.Content>
  </Card.Root>
</div>