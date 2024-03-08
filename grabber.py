import requests
from bs4 import BeautifulSoup
import pyperclip

page = 1
tags = []
def get_game_url():
    global page, tags

    # Initialize the base URL
    base_url = "https://itch.io/games/platform-web"

    # Modify the URL for each tag
    for tag in tags:
        base_url += "/tag-" + tag

    # Append the page number to the URL
    url = base_url + "?page=" + str(page)

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

    print("(Took "+str(round(response.elapsed.total_seconds()*1000))+" MS)")
    print("")

    while True:
        # Ask the user for a number corresponding to the game
        selected_game = input("Enter the game number/URL ('exit' to quit/'next' to load more): ")
        print("")

        dontGet = False

        if selected_game.lower() == 'exit':
            print("Exiting the Itch Game Grabber. Goodbye!")
            return
        if selected_game.lower() == 'next':
            print("Getting more games...")
            page += 1
            get_game_url()
            return
        if "itch.io" in selected_game:
            url = selected_game
            selected_game = 0
            dontGet = True

        try:
            selected_game = int(selected_game)
            # Check if the selected number is valid
            if 0 <= selected_game < len(href_list):
                # Get the href corresponding to the selected game and print it
                selected_href = href_list[selected_game]

                if not dontGet:
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

                    #Attempt copy to clipboard
                    try:
                        pyperclip.copy(iframe_src)
                    except Exception:
                        print("No clipboard found.")

                    print("(Took "+str(round(r.elapsed.total_seconds()*1000))+" MS)")
                    print("")

                except (KeyError, TypeError):
                    # If iframe_src doesn't exist or encountered parsing errors, try finding iframe with id "game_drop"
                    try:
                        game_drop_iframe = soup.find('iframe', {'id': 'game_drop'})
                        if game_drop_iframe:
                            print("Game Source (copied): "+game_drop_iframe['src'])

                            # Attempt copy to clipboard
                            try:
                                pyperclip.copy(game_drop_iframe['src'])
                            except Exception:
                                print("No clipboard found.")

                            print("(Took "+str(round(r.elapsed.total_seconds()*1000))+" MS)")
                            print("")
                        else:
                            print("No source found")
                    except AttributeError:
                        print("No source found")
                except Exception as e:
                    print("An error occurred:", e)
            else:
                print("Invalid input.")

        except ValueError:
            print("Invalid input.")

if __name__ == "__main__":
    page_input = input("Enter page number: ")

    try:
        if page_input != "":
            page = int(page_input)
    except (KeyError, TypeError):
        print("invalid")

    tags_input = input("Enter tags separated by commas: ")
    tags = [tag.strip() for tag in tags_input.split(',')]
    get_game_url()
