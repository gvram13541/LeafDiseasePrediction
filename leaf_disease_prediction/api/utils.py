import requests
from bs4 import BeautifulSoup
from googleapiclient.discovery import build
import os
from dotenv import load_dotenv

load_dotenv()

YOUTUBE_API_KEY = os.getenv('YOUTUBE_API_KEY')

def scrape_articles(query, num_articles=5):
    print(query)
    url = f"https://www.google.com/search?q={query}disease"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }

    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        print(f"Request failed with status code: {response.status_code}")
        return []

    soup = BeautifulSoup(response.text, 'html.parser')

    articles = []
    # print("HTML Content:", soup.prettify()[:1000]) 

    search_results = soup.find_all('div', class_='tF2Cxc')
    print(f"Found {len(search_results)} search result blocks")

    for result in search_results[:num_articles]:
        # print("Found div with class 'tF2Cxc':", result)  

        # Extracting link, title, and snippet from the search result
        link_tag = result.find('a')
        title_tag = result.find('h3')
        snippet_tag = result.find('div', class_='IsZvec')

        if link_tag and title_tag and snippet_tag:
            link = link_tag['href']
            title = title_tag.get_text()
            snippet = snippet_tag.get_text()

            articles.append({
                'title': title,
                'link': link,
                'snippet': snippet
            })

    print("Articles found:", articles)  
    return articles

def fetch_youtube_videos(query, max_results=5):
    """
    Fetch YouTube videos related to the given query using the YouTube Data API.
    """
    youtube = build('youtube', 'v3', developerKey=YOUTUBE_API_KEY)
    
    try:
        search_response = youtube.search().list(
            q=query + " plant disease",
            type='video',
            part='id,snippet',
            maxResults=max_results
        ).execute()
        
        videos = []
        for search_result in search_response.get('items', []):
            video = {
                'title': search_result['snippet']['title'],
                'description': search_result['snippet']['description'],
                'thumbnail': search_result['snippet']['thumbnails']['default']['url'],
                'video_id': search_result['id']['videoId']
            }
            videos.append(video)
        
        return videos
    
    except Exception as e:
        print(f"An error occurred: {e}")
        return []

# test
if __name__ == "__main__":
    query = "tomato leaf curl virus"
    print("Scraping articles...")
    articles = scrape_articles(query)
    for article in articles:
        print(f"Title: {article['title']}")
        print(f"Link: {article['link']}")
        print(f"Snippet: {article['snippet']}")
        print("---")
    
    print("\nFetching YouTube videos...")
    videos = fetch_youtube_videos(query)
    for video in videos:
        print(f"Title: {video['title']}")
        print(f"Video ID: {video['video_id']}")
        print(f"Thumbnail: {video['thumbnail']}")
        print("---")