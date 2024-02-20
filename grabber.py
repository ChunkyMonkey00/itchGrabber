import requests
from bs4 import BeautifulSoup

# Send a GET request to the URL
url = "https://itch.io/games/platform-web"
response = requests.get(url)

# Parse the HTML content
soup = BeautifulSoup(response.content, 'html.parser')

# Find all "a" elements with classes "title" and "game_link"
game_links = soup.find_all('a', class_='title game_link')

# Initialize an ordered list to store the href attributes
href_list = []

# Loop through the game links, print the title with its index, and store the href in the list
for i, link in enumerate(game_links):
    print(f"{i}: {link.text}")
    href_list.append(link['href'])

# Ask the user for a number corresponding to the game
selected_game = int(input("Enter the number corresponding to the game: "))

# Check if the selected number is valid
if 0 <= selected_game < len(href_list):
    # Get the href corresponding to the selected game and print it
    selected_href = href_list[selected_game]
    print(f"The href for the selected game is: {selected_href}")
else:
    print("Invalid input. Please enter a number within the range.")

url = selected_href

try:
    r = requests.get(url)
    content = r.content

    soup = BeautifulSoup(content, 'html.parser')

    # Find the iframe element within the data-iframe attribute
    iframe_data = soup.find('div', {'class': 'iframe_placeholder'})['data-iframe']

    # Parse the iframe data as HTML to find the src attribute
    iframe_soup = BeautifulSoup(iframe_data, 'html.parser')
    iframe_src = iframe_soup.find('iframe')['src']

    # Print the URL
    print(iframe_src)

except (KeyError, TypeError):
    # If iframe_src doesn't exist or encountered parsing errors, try finding iframe with id "game_drop"
    try:
        game_drop_iframe = soup.find('iframe', {'id': 'game_drop'})
        if game_drop_iframe:
            print(game_drop_iframe['src'])
        else:
            print("No source found")
    except AttributeError:
        print("No source found")
except Exception as e:
    print("An error occurred:", e)
