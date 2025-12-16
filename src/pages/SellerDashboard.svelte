<script lang="ts">
  import { onMount } from 'svelte';
  import { api, type SellerItem, type SellerOrder } from '../lib/api';
  import { session } from '../lib/auth';
  import { get } from 'svelte/store';

  let items: SellerItem[] = [];
  let orders: SellerOrder[] = [];
  let loading = true;
  let error = '';

  let name = '';
  let description = '';
  let price = 0;
  let stock = 0;

  async function load() {
    loading = true;
    error = '';
    try {
      const s = get(session);
      if (!s) return;
      items = await api.sellerGetItems(s.token);
      orders = await api.sellerGetOrders(s.token);
    } catch (e) {
      error = (e as Error).message;
    } finally {
      loading = false;
    }
  }

  onMount(load);

  async function createItem() {
    try {
      const s = get(session);
      if (!s) return;
      await api.sellerCreateItem(s.token, { name, description, price: Number(price), stock: Number(stock) });
      name = ''; description = ''; price = 0; stock = 0;
      await load();
    } catch (e) {
      error = (e as Error).message;
    }
  }
</script>

<h2>Vendedor: Panel</h2>

{#if error}<p class="error">❌ {error}</p>{/if}

<section class="panel">
  <h3>Crear artículo</h3>
  <div class="grid">
    <label>Nombre <input bind:value={name} /></label>
    <label>Precio <input type="number" min="0" step="0.01" bind:value={price} /></label>
    <label>Stock <input type="number" min="0" step="1" bind:value={stock} /></label>
    <label class="span">Descripción <input bind:value={description} /></label>
  </div>
  <button on:click={createItem}>Guardar</button>
</section>

{#if loading}
  <p>Cargando...</p>
{:else}
  <section class="panel">
    <h3>Mis artículos</h3>
    <ul>
      {#each items as it (it.id)}
        <li><b>{it.name}</b> — ${Number(it.price).toFixed(2)} — stock: {it.stock}</li>
      {/each}
    </ul>
  </section>

  <section class="panel">
    <h3>Pedidos de mis artículos</h3>
    <ul>
      {#each orders as o (o.id)}
        <li>
          <b>{o.item_name}</b> x{o.qty} — {o.customer_name} — {o.customer_phone}
          <div class="muted">{o.customer_address}</div>
        </li>
      {/each}
    </ul>
  </section>
{/if}

<style>
  .panel { border: 1px solid #eee; border-radius: 14px; padding: 12px; margin: 12px 0; }
  .grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
  .span { grid-column: span 3; }
  label { display: grid; gap: 6px; }
  input { padding: 8px 10px; border: 1px solid #ccc; border-radius: 10px; }
  button { margin-top: 10px; padding: 10px 12px; border-radius: 12px; border: 1px solid #333; background: white; cursor: pointer; }
  .muted { opacity: 0.75; font-size: 0.9rem; }
  .error { color: #b71c1c; }
</style>
