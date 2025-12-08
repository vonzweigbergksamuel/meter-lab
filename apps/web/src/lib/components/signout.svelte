<script lang="ts">
import { browser } from "$app/environment";
import { authClient } from "@/auth-client";

if (browser) {
  const form = document.querySelector('form')
  form?.addEventListener('submit', async (event) => {
    event.preventDefault()

    await authClient.signOut()
    
    console.log("Submit Sign Out")

    window.location.href = "/login"
  })
}
</script>

<form method="post" action="/admin/api/logout" class="my-auto">
  <button
    type="submit"
    class="h-9 px-3 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition border border-red-200"
  >
    Sign Out
  </button>
</form>