<script lang="ts">
  import { api } from '../lib/api';
  import { setSession } from '../lib/auth';

  let mode: 'login' | 'register' = 'login';

  let role: 'seller' | 'client' = 'client';
  let name = '';
  let email = '';
  let password = '';
  let phone = '';
  let address = '';

  let loading = false;
  let error = '';

  async function submit() {
    loading = true;
    error = '';
    try {
      if (mode === 'login') {
        const r = await api.login({ email, password });
        setSession({ token: r.token, user: r.user });
      } else {
        await api.register({ role, name, email, password, phone, address });
        alert('Registro exitoso. Ahora inicia sesión.');
        mode = 'login';
        password = '';
        }

    } catch (e) {
      error = (e as Error).message;
    } finally {
      loading = false;
    }
  }
</script>

<div class="card">
  <h2>{mode === 'login' ? 'Iniciar sesión' : 'Registrarse'}</h2>

  <div class="tabs">
    <button class:active={mode==='login'} on:click={() => (mode='login')}>Login</button>
    <button class:active={mode==='register'} on:click={() => (mode='register')}>Registro</button>
  </div>

  {#if mode === 'register'}
    <label>
      Rol
      <select bind:value={role}>
        <option value="client">Cliente</option>
        <option value="seller">Vendedor</option>
      </select>
    </label>

    <label>
      Nombre
      <input bind:value={name} placeholder="Tu nombre" />
    </label>

    <label>
      Teléfono
      <input bind:value={phone} placeholder="099..." />
    </label>

    <label>
      Dirección
      <input bind:value={address} placeholder="Av..., casa..." />
    </label>
  {/if}

  <label>
    Email
    <input bind:value={email} placeholder="correo@ejemplo.com" />
  </label>

  <label>
    Password
    <input type="password" bind:value={password} placeholder="mínimo 6" />
  </label>

  <button on:click={submit} disabled={loading}>
    {loading ? 'Cargando...' : (mode === 'login' ? 'Entrar' : 'Crear cuenta')}
  </button>

  {#if error}
    <p class="error">❌ {error}</p>
  {/if}
</div>

<style>
  .card { max-width: 420px; margin: 24px auto; padding: 16px; border: 1px solid #ddd; border-radius: 14px; }
  .tabs { display: flex; gap: 8px; margin-bottom: 12px; }
  button { padding: 10px 12px; border-radius: 12px; border: 1px solid #333; background: white; cursor: pointer; }
  .tabs button { border-color: #ccc; }
  .tabs button.active { border-color: #333; }
  label { display: grid; gap: 6px; margin: 10px 0; }
  input, select { padding: 8px 10px; border: 1px solid #ccc; border-radius: 10px; }
  .error { color: #b71c1c; }
</style>
