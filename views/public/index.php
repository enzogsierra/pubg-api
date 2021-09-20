<main class="container py-3">
    <h2 class="h2 text-center">Search for a PUBG player stats</h2>

    <form class="input-group" method="POST" action="/">
        <input name="id" type="text" value="<?php echo $player; ?>" class="form-control pubg-nicksearch" aria-label="Recipient's username" aria-describedby="button-addon2" required>
        <button class="btn btn-outline-secondary" type="submit" id="button-addon2">Search</button>
    </form>

    <?php if($response == 1): ?>
        <p class="text-muted"><?php echo "Player name contains invalid characters"; ?></p>
    <?php elseif($response == 2): ?>
        <p class="text-muted"><?php echo "Player doesn't exists"; ?></p>
    <?php endif; ?>
</main>

<script src="./build/js/index.js"></script>