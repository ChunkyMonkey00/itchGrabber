import requests
from bs4 import BeautifulSoup
import pyperclip

page = 1

def get_game_url():
    global page

    # Send a GET request to the URL
    url = "https://itch.io/games/platform-web?page="+str(page)
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

    while True:
        # Ask the user for a number corresponding to the game
        selected_game = input("Enter the game number ('exit' to quit/'next' to load more): ")

        if selected_game.lower() == 'exit':
            print("Exiting the Itch Game Grabber. Goodbye!")
            return
        if selected_game.lower() == 'next':
            print("Getting more games...")
            page += 1
            get_game_url()
            return

        try:
            selected_game = int(selected_game)
            # Check if the selected number is valid
            if 0 <= selected_game < len(href_list):
                # Get the href corresponding to the selected game and print it
                selected_href = href_list[selected_game]

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
                    print("Game Source (copied): "+iframe_src)
                    pyperclip.copy(iframe_src)

                except (KeyError, TypeError):
                    # If iframe_src doesn't exist or encountered parsing errors, try finding iframe with id "game_drop"
                    try:
                        game_drop_iframe = soup.find('iframe', {'id': 'game_drop'})
                        if game_drop_iframe:
                            print("Game Source (copied): "+game_drop_iframe['src'])
                            pyperclip.copy(game_drop_iframe['src'])
                        else:
                            print("No source found")
                    except AttributeError:
                        print("No source found")
                except Exception as e:
                    print("An error occurred:", e)
            else:
                print("Invalid input. Please enter a number within the range.")

        except ValueError:
            print("Invalid input. Please enter a valid number or 'exit' to quit.")

if __name__ == "__main__":
    get_game_url()
