let store = {
    user: { name: "Visitor" },
    apod: '',
    rovers: ['Curiosity', 'Opportunity', 'Spirit'],
}

// add our markup to the page
const root = document.getElementById('root')

const updateStore = (store, newState) => {
    store = Object.assign(store, newState)
    render(root, store)
}

const render = async (root, state) => {
    root.innerHTML = App(state)
}


// create content
const App = (state) => {
    let { rovers, apod } = state

    return `
        <header></header>
        <main>
            <div class="container">
                ${Greeting(store.user.name)}
                <section>
                    <h3>Let's learn something about Mars Rovers (while I learn about Node.JS and Express.JS) 👾  🛰</h3>
                    <p>There are three Rovers currently on Mars (that we know of 👀): ${store.rovers.join(', ')}.</p>
                    <p>You can fetch recent, real-world data from each one of them here:</p>
                    <div class="rover_group">
                        <div class="rover_tag">
                        Curiosity
                        </div>
                        <div class="rover_tag">
                        Opportunity
                        </div>
                        <div class="rover_tag">
                        Spirit
                        </div>
                    </div>
                    ${CuriosityManifestData()}
                    ${ImageOfTheDay(apod)}
                </section>
            </div>
        </main>
        <footer></footer>
    `
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store)
})

// ------------------------------------------------------  COMPONENTS

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
const Greeting = (name) => {
    if (name) {
        return `
            <h1>Welcome, ${name}!</h1>
        `
    }

    return `
        <h1>Hello!</h1>
    `
}

// Example of a pure function that renders infomation requested from the backend
const ImageOfTheDay = (apod) => {
    // If image does not already exist, or it is not from today -- request it again
    const today = new Date()
    const photodate = new Date(apod.date)
    console.log(photodate.getDate(), today.getDate());

    console.log(photodate.getDate() === today.getDate());
    if (!apod || apod.date === today.getDate() ) {
        getImageOfTheDay(store)
    }

    // check if the photo of the day is actually type video!
    if (apod.media_type === "video") {
        return (`
            <p>See today's featured video <a href="${apod.url}">here</a></p>
            <p>${apod.title}</p>
            <p>${apod.explanation}</p>
        `)
    } else {
        return `
            <img src="${apod.image.url}" height="350px" width="100%" />
            <p>${apod.image.explanation}</p>
        `
    }
}

//render the data from the Curiosity Manifest API call 
const CuriosityManifestData = () => {
    console.log(store.curiosity_manifest_data);
    if (!store.curiosity_manifest_data) {
      getCuriosityManifestData();
      return "";
    } else {
      return ` 
      <div>
          ${store.curiosity_manifest_data.latest_photos[0].rover.launch_date}
      </div> `;
    }
  };
  
    

// ------------------------------------------------------  API CALLS

// Example API call
const getImageOfTheDay = (state) => {
    let { apod } = state

    fetch(`http://localhost:3000/apod`)
        .then(res => res.json())
        .then(apod => updateStore(store, { apod }))
}

// //curiosity manifest data
const getCuriosityManifestData = () => {
    const manifestData = fetch(`http://localhost:3000/curiosity_manifest_data`)
      .then((res) => res.json())
      .then((res) =>
        updateStore(store, {
          curiosity_manifest_data: res.curiosity_manifest_data,
        })
      )
      .then(() => console.log(store));
  };
