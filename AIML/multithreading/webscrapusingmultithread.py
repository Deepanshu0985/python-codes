# https://www.geeksforgeeks.org/python/stack-in-python/
# https://www.geeksforgeeks.org/python/stack-in-python/
# https://www.w3schools.com/dsa/dsa_data_stacks.php

import threading
import requests
from bs4 import BeautifulSoup

def fetchcontent(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')
    print(f"{len(soup.text)} characters fetched from {url}")

# if __name__ == "__main__":
url = ["https://www.geeksforgeeks.org/python/stack-in-python/",
        "https://www.geeksforgeeks.org/python/stack-in-python/",
        "https://www.w3schools.com/dsa/dsa_data_stacks.php"]

threads = []
for u in url:
    thread = threading.Thread(target=fetchcontent, args=(u,))
    threads.append(thread)
    thread.start()

for thread in threads:
    thread.join()