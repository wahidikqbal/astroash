<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import * as Card from '$lib/components/ui/card';

  let email = $state('');
  let password = $state('');
  let loading = $state(false);
  let error = $state('');

  async function handleSubmit() {
    if (!email || !password) {
      error = 'Email dan password wajib diisi';
      return;
    }

    loading = true;
    error = '';

    try {
      const res = await fetch('/api/login', { // Proxy ke API backend
        method: 'POST',
        headers: {
          'Content-Type': 'application/vnd.api+json',
          'Accept': 'application/vnd.api+json',
        },
        body: JSON.stringify({ 
          data: {
            attributes: { email, password },
            relationships: {},
            type: 'user',
          }
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        error = data.errors?.[0]?.detail || data.message || 'Login gagal';
        return;
      }

      window.location.href = '/me';
    } catch (e) {
      error = 'Terjadi kesalahan, coba lagi';
    } finally {
      loading = false;
    }
  }
</script>

<Card.Root class="w-full max-w-sm">
  <Card.Header>
    <Card.Title class="text-2xl">Login</Card.Title>
    <Card.Description>Masukkan email dan password Anda</Card.Description>
  </Card.Header>

  <Card.Content>
    <div class="flex flex-col gap-4">
      {#if error}
        <p class="text-sm text-destructive">{error}</p>
      {/if}

      <div class="flex flex-col gap-2">
        <Label for="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="nama@email.com"
          bind:value={email}
        />
      </div>

      <div class="flex flex-col gap-2">
        <Label for="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          bind:value={password}
        />
      </div>
    </div>
  </Card.Content>

  <Card.Footer>
    <Button class="w-full" onclick={handleSubmit} disabled={loading}>
      {loading ? 'Memproses...' : 'Login'}
    </Button>
  </Card.Footer>
</Card.Root>