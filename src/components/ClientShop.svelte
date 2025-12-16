<script lang="ts">
  import { onMount } from 'svelte';
  import { api, type Item } from '../lib/api';
  import { session } from '../lib/auth';
  import { get } from 'svelte/store';

  let items: Item[] = [];
  let loading = true;
  let error = '';
  let qtyById: Record<number, number> = {};

  async function load() {
    loading = true;
    error = '';
    try {
      items = await api.getCatalog();
    } catch (e) {
      error = (e as Error).message;
    } finally {
      loading = false;
    }
  }

  onMount(load);

  async function order(item: Item) {
    const s = get(session);
    if (!s) return;

    const qty = Number(qtyById[item.id] ?? 1);

    try {
      await api.clientCreateOrder(s.token, { item_id: item.id, qty });
      alert('✅ Pedido registrado');
      await load();
    } catch (e) {
      alert(`❌ ${(e as Error).message}`);
    }
  }
</script>

<h2>Cliente: Catálogo</h2>

{#if error}<p class="error">❌ {error}</p>{/if}

{#if loading}
  <p>Cargando...</p>
{:else}
  <div class="grid">
    {#each items as item (item.id)}
      <div class="card">
        <h3>{item.name}</h3>
        {#if item.description}<p class="muted">{item.description}</p>{/if}
        <p><b>${Number(item.price).toFixed(2)}</b> · Stock: {item.stock}</p>

        <div class="row">
          <input
            type="number"
            min="1"
            max={item.stock}
            bind:value={qtyById[item.id]}
            placeholder="1"
            disabled={item.stock <= 0}
          />
          <button on:click={() => order(item)} disabled={item.stock <= 0}>
            {item.stock <= 0 ? 'Sin stock' : 'Pedir'}
          </button>
        </div>
      </div>
    {/each}
  </div>
{/if}

<style>
  .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 12px; }
  .card { border: 1px solid #eee; border-radius: 14px; padding: 12px; }
  .row { display: flex; gap: 8px; margin-top: 10px; }
  input { width: 90px; padding: 8px 10px; border: 1px solid #ccc; border-radius: 10px; }
  button { padding: 10px 12px; border-radius: 12px; border: 1px solid #333; background: white; cursor: pointer; }
  .muted { opacity: 0.75; }
  .error { color: #b71c1c; }
</style>
