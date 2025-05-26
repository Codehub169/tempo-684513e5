from flask import Flask, render_template, request

app = Flask(__name__)

# Game data: A list of dictionaries, each representing a game.
# This data will be used to populate game selection pages and load game-specific content.
# Includes ID, name, description, path to the game's JavaScript file, and an image URL.
# Corrected names and descriptions to match actual game JS files and script paths for url_for.
GAMES = [
    {
        "id": "game1", 
        "name": "Starship Trader", 
        "description": "Amass a fortune by buying and selling goods across the galaxy in this trading simulation.", 
        "script": "games/game1.js", 
        "image": "https://images.unsplash.com/photo-1518301590127-978041376c0f?w=600&h=400&fit=crop&q=80"
    },
    {
        "id": "game2", 
        "name": "Asteroid Miner", 
        "description": "Equip your laser and mine valuable ores from asteroids, managing your power.", 
        "script": "games/game2.js", 
        "image": "https://images.unsplash.com/photo-1607399470940-0470f20cc967?w=600&h=400&fit=crop&q=80"
    },
    {
        "id": "game3", 
        "name": "Alien Translator", 
        "description": "Translate alien words to English, deciphering an extraterrestrial language.", 
        "script": "games/game3.js", 
        "image": "https://images.unsplash.com/photo-1581093447478-27a0ef529890?w=600&h=400&fit=crop&q=80"
    },
    {
        "id": "game4", 
        "name": "Space Navigator", 
        "description": "Navigate your spaceship to designated coordinates in the vastness of space.", 
        "script": "games/game4.js", 
        "image": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop&q=80"
    },
    {
        "id": "game5", 
        "name": "Code Breaker", 
        "description": "Guess the secret numerical code within a limited number of attempts.", 
        "script": "games/game5.js", 
        "image": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&h=400&fit=crop&q=80"
    },
    {
        "id": "game6", 
        "name": "Galactic Quizmaster", 
        "description": "Test your knowledge with a variety of questions about space and science fiction.", 
        "script": "games/game6.js", 
        "image": "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=600&h=400&fit=crop&q=80"
    },
    {
        "id": "game7", 
        "name": "Drone Escape", 
        "description": "Pilot your drone through a perilous urban canyon, evading security patrols and obstacles.", 
        "script": "games/game7.js", 
        "image": "https://images.unsplash.com/photo-1527153999045-54c65b05743e?w=600&h=400&fit=crop&q=80"
    },
    {
        "id": "game8", 
        "name": "Net Runner's Gauntlet", 
        "description": "A high-speed infinite runner. Dodge incoming data packets and breach virtual firewalls.", 
        "script": "games/game8.js", 
        "image": "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&h=400&fit=crop&q=80"
    },
    {
        "id": "game9", 
        "name": "Cybernetic Sorter", 
        "description": "Rapidly categorize incoming data fragments into their designated slots before the system buffer overflows.", 
        "script": "games/game9.js", 
        "image": "https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=600&h=400&fit=crop&q=80"
    },
    {
        "id": "game10", 
        "name": "Stealth Infiltrator", 
        "description": "A turn-based strategy game. Evade guards, bypass security, and reach your objective undetected.", 
        "script": "games/game10.js", 
        "image": "https://images.unsplash.com/photo-1569705461980-c21d0f733013?w=600&h=400&fit=crop&q=80"
    }
]

@app.route('/')
def home():
    """Serves the home page (index.html)."""
    return render_template('index.html', page_title="Welcome - Cyberpunk Game Hub")

@app.route('/games')
def games_selection():
    """Serves the game selection page (games_selection.html), passing the list of games."""
    return render_template('games_selection.html', page_title="Select a Game - Cyberpunk Game Hub", games=GAMES)

@app.route('/play/<game_id>')
def game_play(game_id):
    """Serves the game play page (game_play.html) for a specific game.
    It finds the game by ID from the GAMES list.
    If the game is not found, it returns a 404 error.
    """
    game = next((g for g in GAMES if g['id'] == game_id), None)
    if game:
        return render_template('game_play.html', page_title=f"Playing {game['name']} - Cyberpunk Game Hub", game=game)
    else:
        # If game not found, render 404.html with appropriate title and status code
        return render_template('404.html', page_title="Game Not Found - Cyberpunk Game Hub"), 404

@app.route('/about')
def about():
    """Serves the about page (about.html)."""
    return render_template('about.html', page_title="About - Cyberpunk Game Hub")

# Route for handling 404 errors more gracefully
@app.errorhandler(404)
def page_not_found(e):
    """Serves a custom 404 error page."""
    # The 'e' variable contains information about the error, can be logged if needed.
    # Example: app.logger.warning(f"Page not found: {e.name} for {request.url}")
    return render_template('404.html', page_title="Page Not Found - Cyberpunk Game Hub"), 404

# Generic error handler for 500 Internal Server Error
@app.errorhandler(500)
def internal_server_error(e):
    """Serves a custom 500 error page for unhandled exceptions."""
    # For actual debugging in production, you'd want to log the error.
    # Example: app.logger.error(f"Server Error: {e}", exc_info=True)
    return render_template('500.html', page_title="Server Error - Cyberpunk Game Hub"), 500

if __name__ == '__main__':
    # This block is for direct execution (python app.py).
    # The startup.sh script uses `flask run`, which handles port and host.
    # Debug mode should be False in a production environment.
    app.run(host='0.0.0.0', port=9000, debug=True)
