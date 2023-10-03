class NetflixApp extends HTMLElement {
  constructor() {
    super();
    this.apiKeyV3 = 'bd4a7d1ebdd5ce08eee316429cfee66a';
    this.apiKeyV4 = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiZDRhN2QxZWJkZDVjZTA4ZWVlMzE2NDI5Y2ZlZTY2YSIsInN1YiI6IjU4MzNkNzJkYzNhMzY4MzM5OTAwN2UyNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.pqrdFY31NucmWKYDFIriI6eOdZseR2s5xRqsVD1Wai0';
    
    this.template = document.createElement('template');
    this.template.innerHTML = `
      <style>
        main.app {
          background-color: black;
          color: white;
          font-family: sans-serif;
          margin: 0;
        }
      </style>
      <main class="app">
        <slot name="nav"></slot>
        <hero-trailer movie=""></hero-trailer>
        <show-lists apiKey=""></show-lists>
      </main>
    `;
  }
  
  async connectedCallback() {
    await this.retrieveData();
    this.render();
  }
  
  async retrieveData() {
    this.heroMovie = await this.getRandomMovie();
  }
  
  async getRandomMovie() {
    const resultsPerPage = 20;
    const discoverUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${this.apiKeyV3}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1`;
    let response;
    let data;
    try {
      response = await fetch(discoverUrl);
      if (response.ok) {
        data = await response.json();
      }
    } catch(e) {
      throw new Error(e);
    }
    
    const randomIndexBelowLimit = Math.floor(Math.random() * resultsPerPage);
    const randomMovie = data.results[randomIndexBelowLimit];
    return randomMovie;
  }
  
  passHeroData() {
    const hero = this.template.content.querySelector('hero-trailer');
    hero.setAttribute('movie', JSON.stringify(this.heroMovie));
  }
  
  passListData() {
    const listContainer = this.template.content.querySelector('show-lists');
    listContainer.setAttribute('apiKey', this.apiKeyV3);
  }
  
  render() {
    this.passHeroData();
    this.passListData();
    
    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(this.template.content.cloneNode(true));
  }
}


/********************************
* NAV
********************************/

class TopNav extends HTMLElement {
  constructor() {
    super();
    this.template = document.createElement('template');
    this.template.innerHTML = `
      <style>
        nav {
          background-color: black;
          box-sizing: border-box;
          display: flex;
          height: 80px;
          padding: 0 60px;
          position: fixed;
          top: 0px;
          line-height: 80px;
          width: 100%;
          z-index: 1;
        }

        .links {
          display: flex;
          justify-content: space-between;
          width: 100%;
        }

        .links div {
          display: flex;
        }

        a {
          color: white;
          display: flex;
          text-decoration: none;
          margin: 0 10px;
          transition: 0.4s;
        }

        a svg {
          fill: white;
          width: 20px;
        }

        a:hover {
          color: gray;
        }

        .logo { margin-right: 60px; }

        .logo svg {
          cursor: pointer;
          width: 100px;
        }
      </style>
      <nav>
        <div class="logo"><svg viewBox="0 0 111 30" fill="#e50914" id="netflix-logo" width="100%" height="100%"><path d="M105.062 14.28L111 30c-1.75-.25-3.499-.563-5.28-.845l-3.345-8.686-3.437 7.969c-1.687-.282-3.344-.376-5.031-.595l6.031-13.75L94.468 0h5.063l3.062 7.874L105.875 0h5.124l-5.937 14.28zM90.47 0h-4.594v27.25c1.5.094 3.062.156 4.594.343V0zm-8.563 26.937c-4.187-.281-8.375-.53-12.656-.625V0h4.687v21.875c2.688.062 5.375.28 7.969.405v4.657zM64.25 10.657v4.687h-6.406V26H53.22V0h13.125v4.687h-8.5v5.97h6.406zm-18.906-5.97V26.25c-1.563 0-3.156 0-4.688.062V4.687h-4.844V0h14.406v4.687h-4.874zM30.75 15.593c-2.062 0-4.5 0-6.25.095v6.968c2.75-.188 5.5-.406 8.281-.5v4.5l-12.968 1.032V0H32.78v4.687H24.5V11c1.813 0 4.594-.094 6.25-.094v4.688zM4.78 12.968v16.375C3.094 29.531 1.593 29.75 0 30V0h4.469l6.093 17.032V0h4.688v28.062c-1.656.282-3.344.376-5.125.625L4.78 12.968z"></path></svg>
        </div>
        <div class="links">
          <div class="left-links"></div>
          <div class="right-links"></div>
        </div>
      </nav>
    `;
  }
  
  connectedCallback() {
    this.constructLinks();
    this.render();
  }
  
  constructLinks() {
    this.constructLeftLinks();
    this.constructRightLinks();
  }
  
  constructLeftLinks() {
    const leftLinkNames = ['Home', 'TV Shows', 'Movies', 'Recently Added', 'My List'];
    const leftLinkContainer = this.template.content.querySelector('.left-links');

    const leftFragment = document.createDocumentFragment();
    leftLinkNames.forEach((name) => {
      const a = document.createElement('a');
      a.href = '#';
      a.textContent = name;
 
      leftFragment.appendChild(a);
    });
    
    leftLinkContainer.appendChild(leftFragment);
  }
  
  constructRightLinks() {
    const rightLinks = [
      {
        name: 'Search',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56.966 56.966">
  <path d="M55.146 51.887L41.588 37.786A22.926 22.926 0 0 0 46.984 23c0-12.682-10.318-23-23-23s-23 10.318-23 23 10.318 23 23 23c4.761 0 9.298-1.436 13.177-4.162l13.661 14.208c.571.593 1.339.92 2.162.92.779 0 1.518-.297 2.079-.837a3.004 3.004 0 0 0 .083-4.242zM23.984 6c9.374 0 17 7.626 17 17s-7.626 17-17 17-17-7.626-17-17 7.626-17 17-17z"/>
</svg>`
      },
      {
        name: 'DVD',
      },
      {
        name: 'Notifications',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512.001 512.001">
  <path d="M504.45 365.901c-60.22-60.237-69.282-90.462-69.282-186.701C435.168 80.23 354.955 0 256.002 0S76.836 80.231 76.836 179.2c0 51.891-1.382 71.262-8.525 95.044-8.883 29.628-27.119 57.993-60.766 91.657-16.119 16.128-4.701 43.699 18.1 43.699h142.054l-1.289 12.8c0 49.485 40.107 89.6 89.583 89.6s89.583-40.115 89.583-89.6l-1.289-12.8H486.35c22.81 0 34.228-27.571 18.1-43.699zM256.01 486.4c-35.337 0-63.991-28.663-63.991-64l1.289-12.8h125.389l1.306 12.8c-.001 35.337-28.656 64-63.993 64zM25.653 384c76.783-76.8 76.783-128 76.783-204.8 0-84.821 68.753-153.6 153.566-153.6s153.566 68.779 153.574 153.6c0 76.8 0 128 76.783 204.8H25.653z"/>
</svg>`
      },
      {
        name: 'Profile',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 482.9 482.9">
  <path d="M239.7 260.2h3.2c29.3-.5 53-10.8 70.5-30.5 38.5-43.4 32.1-117.8 31.4-124.9-2.5-53.3-27.7-78.8-48.5-90.7C280.8 5.2 262.7.4 242.5 0H240.8c-11.1 0-32.9 1.8-53.8 13.7-21 11.9-46.6 37.4-49.1 91.1-.7 7.1-7.1 81.5 31.4 124.9 17.4 19.7 41.1 30 70.4 30.5zm-75.1-152.9c0-.3.1-.6.1-.8 3.3-71.7 54.2-79.4 76-79.4H241.9c27 .6 72.9 11.6 76 79.4 0 .3 0 .6.1.8.1.7 7.1 68.7-24.7 104.5-12.6 14.2-29.4 21.2-51.5 21.4h-1c-22-.2-38.9-7.2-51.4-21.4-31.7-35.6-24.9-103.9-24.8-104.5z"/>
  <path d="M446.8 383.6v-.3c0-.8-.1-1.6-.1-2.5-.6-19.8-1.9-66.1-45.3-80.9-.3-.1-.7-.2-1-.3-45.1-11.5-82.6-37.5-83-37.8-6.1-4.3-14.5-2.8-18.8 3.3-4.3 6.1-2.8 14.5 3.3 18.8 1.7 1.2 41.5 28.9 91.3 41.7 23.3 8.3 25.9 33.2 26.6 56 0 .9 0 1.7.1 2.5.1 9-.5 22.9-2.1 30.9-16.2 9.2-79.7 41-176.3 41-96.2 0-160.1-31.9-176.4-41.1-1.6-8-2.3-21.9-2.1-30.9 0-.8.1-1.6.1-2.5.7-22.8 3.3-47.7 26.6-56 49.8-12.8 89.6-40.6 91.3-41.7 6.1-4.3 7.6-12.7 3.3-18.8-4.3-6.1-12.7-7.6-18.8-3.3-.4.3-37.7 26.3-83 37.8-.4.1-.7.2-1 .3-43.4 14.9-44.7 61.2-45.3 80.9 0 .9 0 1.7-.1 2.5v.3c-.1 5.2-.2 31.9 5.1 45.3 1 2.6 2.8 4.8 5.2 6.3 3 2 74.9 47.8 195.2 47.8s192.2-45.9 195.2-47.8c2.3-1.5 4.2-3.7 5.2-6.3 5-13.3 4.9-40 4.8-45.2z"/>
</svg>`
      },
    ];
    const rightLinkContainer = this.template.content.querySelector('.right-links');
    
    const rightFragment = document.createDocumentFragment();
    rightLinks.forEach((link) => {
      const a = document.createElement('a');
      a.href = '#';
      if (!link.icon) {
        a.textContent = link.name;
      } else {
        a.innerHTML = link.icon;
      }
      
      rightFragment.appendChild(a);
    });
    
    rightLinkContainer.appendChild(rightFragment);
  }
  
  render() {
    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(this.template.content.cloneNode(true));
  }
}


/********************************
* HERO
********************************/

class HeroTrailer extends HTMLElement {
  constructor() {
    super();

    this.template = document.createElement('template');
  }

  connectedCallback() {
    this.movie = JSON.parse(this.getAttribute('movie'));
    this.render();
  }

  render() {
    const path = `https://image.tmdb.org/t/p/original${this.movie.backdrop_path}`; 

    this.template.innerHTML = `
      <style>
        p {
          color: red;
        }

        section {
          height: 550px;
          background-image: linear-gradient(
            rgba(0, 0, 0, 0.3),
            rgba(0, 0, 0, 0.3)
          ), url('${path}');
          background-repeat: no-repeat;
          background-size: cover;
          width: 100%;
        }

        .infopane {
          padding: 150px 0 0 150px;
          max-width: 700px;
        }

        .title {
          color: white;
          font-size: 3.5rem;
          margin: 20px 0;
        }

        .button-container {
          display: flex;
        }

        button {
          background-color: rgba(30, 30, 30, 0.7);
          border: none;
          border-radius: 5px;
          color: white;
          cursor: pointer;
          font-size: 1.2rem;
          font-weight: 700;
          margin: 10px;
          padding: 15px 40px;
          transition: 0.2s;
        }

        button:hover {
          background-color: white;
          color: black;
        }

        button.play:hover {
          transform: scale(1.1);
        }
      </style>
      <section>
        <div class="infopane">
          <p class="title"></p>
          <div class="button-container">
            <button class="play">▶ Play</button>
            <button class="my-list">+ My List</button>
          </div>
        </div>
      </section>
      `;

    this.renderTitle();

    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(this.template.content.cloneNode(true));
  }
  
  renderTitle() {
    const titleDiv = this.template.content.querySelector('.title');
    titleDiv.textContent = this.movie.title;
  }
}


/********************************
* SHOW LISTS
********************************/

class ShowLists extends HTMLElement {
  constructor() {
    super();
    this.template = document.createElement('template');
    this.template.innerHTML = `
      <style>
        .container {
          margin: 0 60px;
        }
      </style>
      <div class="container">
        <vid-list category="Popular" apiKey=""></vid-list>
        <vid-list category="Top_Rated" apiKey=""></vid-list>
        <vid-list category="Airing_Today" apiKey=""></vid-list>
        <vid-list category="On_The_Air" apiKey=""></vid-list>
      </div>
    `;
  }
  
  connectedCallback() {
    this.passListData();
    this.render();
  }
  
  passListData() {
    const vidLists = this.template.content.querySelectorAll('vid-list');
    vidLists.forEach((list) => {
      list.setAttribute('apiKey', this.getAttribute('apiKey'));
    });
  }
  
  render() {
    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(this.template.content.cloneNode(true));
  }
}

class VidList extends HTMLElement {
  constructor() {
    super();
    
    this.template = document.createElement('template');
    this.template.innerHTML = `
      <style>
        .list-container {
          display: flex;
        }

        .list-category {
          font-size: 1.2rem;
          font-weight: 700;
        }

        .list-container:hover .next {
          display: block;
        }

        .next {
          display: none;
          width: 50px;
          height: 50px;
        }

        .next svg {
          fill: white;
        }
      </style>

      <p class="list-category"></p>
      <div class="list-container">
        <div class="next">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 477.175 477.175">
  <path d="M360.731 229.075l-225.1-225.1c-5.3-5.3-13.8-5.3-19.1 0s-5.3 13.8 0 19.1l215.5 215.5-215.5 215.5c-5.3 5.3-5.3 13.8 0 19.1 2.6 2.6 6.1 4 9.5 4 3.4 0 6.9-1.3 9.5-4l225.1-225.1c5.3-5.2 5.3-13.8.1-19z"/>
</svg>
        </div>
      </div>
    `;
  }
  
  async connectedCallback() {
    this.apiKey = this.getAttribute('apiKey');
    this.movies = await this.fetchMovies();
    this.render();
    this.bindEventListeners();
  }
  
  async fetchMovies() {
    const categoryParam = this.getAttribute('category').toLowerCase();
    const url = `https://api.themoviedb.org/3/tv/${categoryParam}?api_key=${this.apiKey}&language=en-US&page=1`;
    
    let response;
    let data;
    try {
      response = await fetch(url);
      if (response.ok) {
        data = await response.json();
      }
    } catch(e) {
      throw new Error(e);
    }
    return data.results;
  }
  
  render() {
    const listContainer = this.template.content.querySelector('.list-container');
    this.movies.forEach((movie) => {
      const thumbnail = document.createElement('vid-thumbnail');
      thumbnail.setAttribute('movie', JSON.stringify(movie));
      listContainer.appendChild(thumbnail);
    });
    
    const listCategory = this.template.content.querySelector('.list-category');
    const title = this.getAttribute('category');
    const titleWithSpaces = title.replace(/_/g, ' ');
    listCategory.textContent = titleWithSpaces;
    
    this.appendChild(this.template.content.cloneNode(true));
  }
  
  bindEventListeners() {
    const nextDiv = this.querySelector('.list-category');
    const listContainer = this.querySelector('.list-container');
    nextDiv.addEventListener('click', (e) => {
      const distanceToAdvance = 220 * 5;
      listContainer.style.transform = `translateX(-${distanceToAdvance}px)`;
    });
  }
}

class VidThumbnail extends HTMLElement {
  constructor() {
    super();
    
    this.template = document.createElement('template');
    this.template.innerHTML = `
      <style>
        img {
          cursor: pointer;
          width: 220px;
          height: 130px;
          margin-right: 5px;
          object-fit: cover;
          transition: 0.5s;
          transition-delay: 0.3s;
        }

        img:hover {
          transform: scale(1.7);
          margin: 0 85px 0 80px;
        }
      </style>
      <img src="" alt="" />
    `;
  }
  
  connectedCallback() {
    this.render();
  }
  
  render() {
    const movie = JSON.parse(this.getAttribute('movie'));
    const img = this.template.content.querySelector('img');
    const url = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    
    img.setAttribute('src', url);
    img.setAttribute('alt', movie.original_name);
    
    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(this.template.content.cloneNode(true));
  }
}

customElements.define('netflix-app', NetflixApp);
customElements.define('top-nav', TopNav);
customElements.define('hero-trailer', HeroTrailer);
customElements.define('show-lists', ShowLists);
customElements.define('vid-list', VidList);
customElements.define('vid-thumbnail', VidThumbnail)


