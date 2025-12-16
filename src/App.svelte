<script lang="ts">
  import AuthForm from './components/AuthForm.svelte';
  import ClientShop from './components/ClientShop.svelte';
  import SellerDashboard from './pages/SellerDashboard.svelte';
  import { initSession, logout, session } from './lib/auth';
  import { onMount } from 'svelte';

  type View = 'home';
  let view: View = 'home';

  onMount(() => initSession());
</script>

<main>
  <h1>🛒 Tienda Web</h1>

  {#if $session}
    <div class="bar">
      <div>
        Logueado como <b>{$session.user.name}</b> ({$session.user.role})
      </div>
      <button on:click={logout}>Salir</button>
    </div>

    {#if $session.user.role === 'client'}
      <ClientShop />
    {:else}
      <SellerDashboard />
    {/if}
  {:else}
    <AuthForm />
  {/if}

  <footer>
    API: <code>{import.meta.env.VITE_API_URL}</code>
  </footer>
</main>

<style>
  main { max-width: 980px; margin: 0 auto; padding: 16px; font-family: system-ui, Arial; }
  .bar { display: flex; justify-content: space-between; align-items: center; gap: 10px; margin: 10px 0 18px; padding: 10px; border: 1px solid #eee; border-radius: 14px; }
  button { padding: 10px 12px; border-radius: 12px; border: 1px solid #333; background: white; cursor: pointer; }
  footer { margin-top: 28px; opacity: 0.7; }
  code { background: #f3f3f3; padding: 2px 6px; border-radius: 8px; }
</style>
