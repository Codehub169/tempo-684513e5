from flask import Flask, render_template

app = Flask(__name__)

# Game data: A list of dictionaries, each representing a game.
# This data will be used to populate game selection pages and load game-specific content.
# Includes ID, name, description, path to the game's JavaScript file, and an image URL.
# Corrected names and descriptions to match actual game JS files and script paths for url_for.
GAMES = [
    {
        "id": "game1", 
        "name": "Glitch Clicker", 
        "description": "Continuously click to generate 'glitches' and increase your error count in this quirky clicker.", 
        "script": "games/game1.js", 
        "image": "https://via.placeholder.com/600x400.png?text=Glitch+Clicker"
    },
    {
        "id": "game2", 
        "name": "Code Breaker Protocol", 
        "description": "Attempt to guess the secret numerical sequence to bypass security. Limited attempts!", 
        "script": "games/game2.js", 
        "image": "https://via.placeholder.com/600x400.png?text=Code+Breaker"
    },
    {
        "id": "game3", 
        "name": "Data Stream Defender", 
        "description": "Protect the data stream by typing out the falling words before they overwhelm the system.", 
        "script": "games/game3.js", 
        "image": "https://via.placeholder.com/600x400.png?text=Data+Stream+Defender"
    },
    {
        "id": "game4", 
        "name": "Neon Racer", 
        "description": "Pilot your vehicle through a high-speed neon course, avoiding oncoming obstacles.", 
        "script": "games/game4.js", 
        "image": "https://via.placeholder.com/600x400.png?text=Neon+Racer"
    },
    {
        "id": "game5", 
        "name": "Memory Matrix", 
        "description": "Test your recall by matching pairs of cyberpunk-themed symbols on the memory grid.", 
        "script": "games/game5.js", 
        "image": "https://via.placeholder.com/600x400.png?text=Memory+Matrix"
    },
    {
        "id": "game6", 
        "name": "System Shock Sequence", 
        "description": "Memorize and repeat increasingly complex sequences of light and sound in this retro challenge.", 
        "script": "games/game6.js", 
        "image": "https://via.placeholder.com/600x400.png?text=System+Shock+Sequence"
    },
    {
        "id": "game7", 
        "name": "Drone Escape", 
        "description": "Pilot your drone through a perilous urban canyon, evading security patrols and obstacles.", 
        "script": "games/game7.js", 
        "image": "https://via.placeholder.com/600x400.png?text=Drone+Escape"
    },
    {
        "id": "game8", 
        "name": "Net Runner's Gauntlet", 
        "description": "A high-speed infinite runner. Dodge incoming data packets and breach virtual firewalls.", 
        "script": "games/game8.js", 
        "image": "https://via.placeholder.com/600x400.png?text=Net+Runner+Gauntlet"
    },
    {
        "id": "game9", 
        "name": "Cybernetic Sorter", 
        "description": "Rapidly categorize incoming data fragments into their designated slots before the system buffer overflows.", 
        "script": "games/game9.js", 
        "image": "https://via.placeholder.com/600x400.png?text=Cybernetic+Sorter"
    },
    {
        "id": "game10", 
        "name": "Stealth Infiltrator", 
        "description": "A turn-based strategy game. Evade guards, bypass security, and reach your objective undetected.", 
        "script": "games/game10.js", 
        "image": "https://via.placeholder.com/600x400.png?text=Stealth+Infiltrator"
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
