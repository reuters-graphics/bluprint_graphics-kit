<script>
import { browser } from '$app/env';
import Referrals from './Referrals.svelte';
</script>

{#if browser}
  <Referrals />
{/if}