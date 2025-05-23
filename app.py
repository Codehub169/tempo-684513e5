from flask import Flask, render_template

app = Flask(__name__)

# Game data: A list of dictionaries, each representing a game.
# This data will be used to populate game selection pages and load game-specific content.
# Includes ID, name, description, path to the game's JavaScript file, and an image URL.
GAMES = [
    {"id": "game1", "name": "Neon Racer", "description": "High-speed futuristic racing through neon-drenched cityscapes.", "script": "static/games/game1.js", "image": "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y3liZXJwdW5rJTIwY2l0eXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=80"},
    {"id": "game2", "name": "System Crack", "description": "Infiltrate corporate mainframes and bypass AI security.", "script": "static/games/game2.js", "image": "https://images.unsplash.com/photo-1550745165-9bc0b252726c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y3liZXJwdW5rJTIwZ2FtZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=80"},
    {"id": "game3", "name": "Data Dash", "description": "Navigate treacherous data streams, avoiding corruption algorithms.", "script": "static/games/game3.js", "image": "https://images.unsplash.com/photo-1611907071499-93f909480053?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGN5YmVycHVua3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=80"},
    {"id": "game4", "name": "Chrome Combatant", "description": "Engage in augmented reality duels in neon-lit urban arenas.", "script": "static/games/game4.js", "image": "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGN5YmVycHVua3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=80"},
    {"id": "game5", "name": "Net Runner X", "description": "Escape a procedurally generated digital maze before the system purges you.", "script": "static/games/game5.js", "image": "https://images.unsplash.com/photo-1520038410233-7141be7e6f97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGN5YmVycHVua3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=80"}
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
        return render_template('404.html', page_title="Game Not Found - Cyberpunk Game Hub"), 404

@app.route('/about')
def about():
    """Serves the about page (about.html)."""
    return render_template('about.html', page_title="About - Cyberpunk Game Hub")

# Route for handling 404 errors more gracefully if a template exists
@app.errorhandler(404)
def page_not_found(e):
    """Serves a custom 404 error page."""
    # Note: you would create a 404.html template for this.
    # For now, it will use a generic 404 if a specific template isn't found later.
    return render_template('404.html', page_title="Page Not Found - Cyberpunk Game Hub"), 404

if __name__ == '__main__':
    # This block is for direct execution (python app.py).
    # The startup.sh script uses `flask run`, which handles port and host.
    app.run(host='0.0.0.0', port=9000, debug=True)
