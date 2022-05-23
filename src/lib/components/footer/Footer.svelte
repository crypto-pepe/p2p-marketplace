<script lang="ts" constext="module">
  import type { Link } from '$lib/types';

  const SocialItems: Link[] = [
    {
      content: 'Matrix',
      title: 'Matrix',
      href: '#'
    },
    {
      content: 'Medium',
      title: 'Medium',
      href: 'https://crypto-pepe-team.medium.com'
    },
    {
      content: 'Twitter',
      title: 'Twitter',
      href: 'https://twitter.com/cryptopepeteam'
    },
    {
      content: 'Telegram',
      title: 'Telegram',
      href: 'https://t.me/pepe_team'
    },
    {
      content: 'GitHub',
      title: 'GitHub',
      href: 'https://github.com/crypto-pepe'
    }
  ];
</script>

<footer class="footer">
  <div class="footer__version">
    Version:
    <!-- svelte-ignore missing-declaration -->
    <a
      class="footer__version-link"
      href={`https://github.com/crypto-pepe/p2p-marketplace/tree/${__GIT_COMMITHASH__}`}
      referrerpolicy="noopener noreferrer"
      target="_blank"
      title="Github version"
    >
      {__GIT_VERSION__}
    </a>
  </div>
  <div class="footer__copyright">
    Powered by
    <a
      class="footer__copyright-link"
      href="https://pepe.team"
      referrerpolicy="noopener noreferrer"
      target="_blank"
      title="PepeTeam official site"
    >
      PepeTeam
    </a>
  </div>
  <ul class="footer__socials">
    {#each SocialItems as item}
      <li class="footer__socials-item">
        <a
          class="footer__socials-item-link"
          href={item.href}
          title={item.title}
          referrerpolicy="noopener noreferrer"
          target="_blank"
        >
          {item.content}
        </a>
      </li>
    {/each}
  </ul>
</footer>

<style></style>
