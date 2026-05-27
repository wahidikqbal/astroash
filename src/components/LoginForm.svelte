<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import * as Card from '$lib/components/ui/card';

  let email = '';
  let password = '';
  let loading = false;
  let error = '';

  async function handleSubmit() {
    loading = true;
    error = '';

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        error = data.message || 'Login gagal';
        return;
      }

      // Redirect setelah login berhasil
      window.location.href = '/dashboard';
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