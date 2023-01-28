function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function hello() {
    const text = [..."Hello World!"];
    const helloText = document.querySelector('#hello');
    let buffer;
    while (true) {
        for (let char of text) {
            await sleep(120);
            helloText.innerHTML += char;
        }
        await sleep(2300);
        for (let i = text.length; i >= 0; i--) {
            await sleep(80);
            buffer = "";
            for (let j = 0; j < i; j++) {
                buffer += text[j];
            }
            helloText.innerHTML = buffer;
        }
        await sleep(700);
    }
}

// On-scroll animation generator function
function scrollAnimate(element, animationClass) {
    const callback = function (entries) {
        entries.forEach((entry) => {      
            if (entry.isIntersecting) {
                entry.target.classList.add(animationClass);
            } else {
                entry.target.classList.remove(animationClass);
            }
        });
    };

    const observer = new IntersectionObserver(callback);

    const targets = document.querySelectorAll(element);
    targets.forEach(function (target) {
        target.classList.remove(animationClass);
        observer.observe(target);
    });
}

const data = {
    skills: {},
    projects: {},
    about: {},
    general: {}
};
let expanded = null;
let currentFilter = [];

async function getData(section) {
    let url = "/data/" + section + ".json";
    let obj = await (await fetch(url)).json();
    // await sleep(2000);
    return obj[section];
}

async function load(section, callback) {
    while (Object.keys(data[section]).length === 0) {
        data[section] = await getData(section);
    }
    const displayArea = document.querySelector('#'+section + ' > .hidden');
    if (displayArea)
        displayArea.classList.remove("hidden");
    const loading = document.querySelector('#'+section + ' > #loading')
    if (loading)
        loading.classList.add("hidden");

    // console.log(data);
    
    callback();
}

function showSkills() {
    const lang_gr = "from-gr2-1 to-gr2-2";
    const lib_gr = "from-gr3-1 to-gr3-2";
    const tool_gr = "from-gr4-1 to-gr4-2";
    const rate = {
        0: "w-[0.75rem]",
        1: "w-[25%]",
        2: "w-[50%]",
        3: "w-[75%]",
        4: "w-[95%]"
    };
    const template = `
                <div class="px-6 group">
                    <div class="flex mt-3 justify-between w-full items-center">
                        <span> $name$ </span>
                        <img class="h-[2rem] transform duration-150 ease-in
                            lg:motion-safe:opacity-75 lg:motion-safe:group-hover:opacity-100
                            md:motion-safe:group-hover:scale-110"
                            src="./data/images/$icon$" alt="icon">
                    </div>
                    <div class="my-2 rounded-full w-full bg-white/30 h-2">
                        <div class="bg-gradient-to-r $gradient$ $width$
                            h-full rounded-full transform duration-150 ease-in
                            md:motion-safe:group-hover:scale-y-150"></div>
                    </div>
                </div>
                `;
    const languages = document.querySelector("#languages");
    const libraries = document.querySelector("#libraries");
    const tools = document.querySelector("#tools");

    let component, name;
    for (let lang of data.skills.languages) {
        name = Object.keys(lang)[0];
        component = template.replace("$name$", name)
                    .replace("$icon$", lang[name].icon)
                    .replace("$gradient$", lang_gr)
                    .replace("$width$", rate[lang[name].rating]);
        
        languages.innerHTML += component;
    }
    for (let lib of data.skills.libraries) {
        name = Object.keys(lib)[0];
        component = template.replace("$name$", name)
                    .replace("$icon$", lib[name].icon)
                    .replace("$gradient$", lib_gr)
                    .replace("$width$", rate[lib[name].rating]);
        
        libraries.innerHTML += component;
    }
    for (let tool of data.skills.tools) {
        name = Object.keys(tool)[0];
        component = template.replace("$name$", name)
                    .replace("$icon$", tool[name].icon)
                    .replace("$gradient$", tool_gr)
                    .replace("$width$", rate[tool[name].rating]);
        
        tools.innerHTML += component;
    }
}

function showProjects() {
    // console.log(data.projects);

    const sections = {
        web: document.querySelector('#web > .hidden'),
        app: document.querySelector('#app > .hidden'),
        game: document.querySelector('#game > .hidden'),
        web3: document.querySelector('#web3 > .hidden'),
        ml: document.querySelector('#ml > .hidden')
    };
    let number = 0;

    function hideAll(except) {
        for (let section of Object.keys(sections)) {
            if (except !== sections[section]) {
                sections[section].classList.add('hidden');
                sections[section].classList.remove('flex');
                document.querySelector('#' + section + ' header svg').classList.remove('rotate-180');
            }
        }
    }

    async function slideshow(slides, left, right, expand) {
        const images = slides.querySelectorAll(".proj-image");

        for (let image of images) {
            image.classList.add('hidden');
        }
        images[0].classList.remove('hidden');
        let current = 0, len = images.length;
    
        function change(x) {
            images[current].classList.add('hidden');
            current = (current + x) % len;
            if (current === -1) current = len - 1;
            images[current].classList.remove('hidden');
        }
    
        left.addEventListener('click', () => {change(-1);});
        right.addEventListener('click', () => {change(1);});

        expand.addEventListener('click', () => {
            left.classList.toggle('bg-gray-800/80');
            right.classList.toggle('bg-gray-800/80');
            slides.classList.toggle('expanded');
            // srcroll x at the start of slides.parent.parent
            const projList = slides.parentElement.parentElement;
            projList.scrollLeft = 0;
            expanded = slides;
        })
    }

    const template = `
                <div id="proj-$id$" class="flex flex-col lg:flex-row lg:flex-wrap justify-between h-[55vh] lg:h-[45vh] min-w-[90%] sm:min-w-[70%] sm:max-w-[80%] md:min-w-[50%] md:max-w-[70%] lg:w-[50%]">
                    <div class="flex slides transform flex-col flex-grow h-auto w-full lg:w-[60%] lg:flex-grow-0 lg:order-1">    
                        <div class="flex justify-center relative w-full lg:w-auto max-h-[27vh]">
                            <button class="left-btn absolute z-30 left-0 top-0 flex flex-col justify-center h-full">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-auto fill-transparent stroke-gray-400/90 rotate-90" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>  
                            $images$
                            <button class="right-btn absolute z-30 right-0 top-0 flex flex-col justify-center h-full">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-auto fill-transparent stroke-gray-400/90 -rotate-90" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            <button class="expand absolute z-20 h-full w-full top-0 left-0"> </button>
                        </div>
                        <div class="text-bold font-nunito text-2xl text-center py-1 px-2"> $name$ </div>
                    </div>
                    <p class="text-[1rem] leading-snug font-light px-2 lg:px-6 py-auto flex-grow-[2] lg:order-3"> $description$ </p>
                    <div class="flex flex-col justify-between lg:justify-start lg:gap-8 lg:pt-4 flex-grow lg:flex-grow-0 lg:order-2 lg:max-w-[40%]">    
                        <p class="text-[1.1rem] font-normal text-blue-200 px-2 lg:px-4">
                            <span class="hidden xl:block leading-[4rem] font-semibold"> Technologies Used: </span>
                            $techstack$
                        </p>
                        <div class="flex lg:flex-col justify-around lg:justify-start lg:items-center xl:flex-row xl:justify-around lg:gap-2 font-nunito px-2 lg:px-4 pb-1">
                            $link$
                        </div>
                    </div>
                </div>
                <span class="py-4 h-[55vh] lg:h-[45vh] rounded-2xl bg-white/20 min-w-[2px]"> </span>
                `;
    const linkTemplate = `<a href="$href$" class="text-white px-3 py-1 bg-orange-400/80 md:hover:bg-orange-500 focus:bg-orange-500 transition duration-100 rounded-lg"> $linkName$ </a>`;
    const imageTemplate = `<img src="./data/images/$imagepath$" alt="image" class="proj-image rounded-md object-contain">`;

    let component, name, links, tech, images;
    let projID = 1;
    const techList = {};

    const foot = document.querySelector('#foot');

    for (let sec of Object.keys(sections)) {
        document.querySelector('#' + sec + ' header').onclick = () => {
            hideAll(sections[sec]);
            sections[sec].classList.toggle('hidden');
            sections[sec].classList.toggle('flex');
            const svg = document.querySelector('#' + sec + ' header svg');
            svg.classList.toggle('rotate-180');
            if (svg.classList.contains('rotate-180')) {
                foot.classList.add('hidden');
            }
            else foot.classList.remove('hidden');
        }

        number += data.projects[sec].length;

        if (data.projects[sec].length == 0)
            sections[sec].innerHTML = "Projects coming soon";
        else {
            for (let project of data.projects[sec]){
                name = Object.keys(project)[0];

                tech = "";
                for (let x of project[name].techStack) {
                    tech += x + ", ";
                    if (x in techList)
                        techList[x].push(project);
                    else techList[x] = [project];
                }
                tech = tech.slice(0, -2);

                links = "";
                if (project[name].links.github)
                    links += linkTemplate.replace("$linkName$", "GitHub")
                             .replace("$href$", project[name].links.github);
                if (project[name].links.hosted)
                    links += linkTemplate.replace("$linkName$", "Hosted")
                             .replace("$href$", project[name].links.hosted);
                if (project[name].links.demo)
                    links += linkTemplate.replace("$linkName$", "Demo")
                             .replace("$href$", project[name].links.demo);

                images = "";
                images += imageTemplate.replace("$imagepath$", project[name].images.main);
                for (let image of project[name].images.slides) {
                    images += imageTemplate.replace("$imagepath$", image);
                }
                
                component = template
                            .replace("$id$", projID)
                            .replace("$images$", images)
                            .replace("$name$", name)
                            .replace("$description$", project[name].desc)
                            .replace("$link$", links)
                            .replace("$techstack$", tech);

                sections[sec].innerHTML += component;

                projID += 1;
            }
            sections[sec].lastElementChild.classList.add('hidden');
        }
    }
    
    async function filter() {
        const optionTemplate = `<option value="$tech$"> $tech$ </option>`;
        const filterArea = document.querySelector('#filter');
        const filterList = document.querySelector('#filterList');
        const dropdown = filterArea.querySelector('#tech');
        const button = filterArea.querySelector('#add');
        button.disabled = true;
        const filterProjects = document.querySelector('#showFilters');
        const filterProjectsDisplay = filterProjects.querySelector('#display');
        const filterTemplate = `<span class="bg-blue-200/70 text-base/80 px-2 rounded-md border-[1px] border-blue-300 mr-2">
                                    $tech$
                                </span>`;
        const clearBtnHTML = `
                            <button id="clear" class="mr-2 flex items-center transition duration-150 transform motion-safe:hover:translate-y-1 opacity-70 hover:opacity-100">
                                <p> Clear </p> 
                                <svg version="1.1" class="stroke-current h-5 pl-2 w-auto text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
                                    <circle class="path circle" stroke-width="6" stroke-miterlimit="10" cx="65.1" cy="65.1" r="62.1"/>
                                    <line class="path line"stroke-width="6" stroke-linecap="round" stroke-miterlimit="10" x1="34.4" y1="37.9" x2="95.8" y2="92.3"/>
                                    <line class="path line" stroke-width="6" stroke-linecap="round" stroke-miterlimit="10" x1="95.8" y1="38" x2="34.4" y2="92.2"/>
                                </svg>
                            </button>`;

        function updateFilters() {
            filterList.innerHTML = "";
            let filter;
            for (let tech of currentFilter) {
                filter = filterTemplate.replace("$tech$", tech);
                filterList.innerHTML += filter;
            }
            if (currentFilter.length > 0) {
                filterList.innerHTML += clearBtnHTML;
                const clearBtn = filterArea.querySelector('#clear');
                clearBtn.addEventListener('click', () => {
                    currentFilter = [];
                    updateFilters();
                });
                document.querySelector('#allProjects').classList.add('hidden');
                foot.classList.add('hidden');
                filterProjects.classList.remove('hidden');
                filterProjectsDisplay.innerHTML = "";

                let component, name, links, tech, images;
                let projID2 = 1;
                const displayed = [];
                for (let x of currentFilter) {
                    for (let project of techList[x]) {
                        let temp = false
                        for (y of displayed)
                            if (project == y) {
                                temp = true;
                                break;
                            }
                        if (temp)
                            continue;

                        name = Object.keys(project)[0];

                        tech = "";
                        for (let y of project[name].techStack) {
                            tech += y + ", ";
                        }
                        tech = tech.slice(0, -2);
                    
                        links = "";
                        if (project[name].links.github)
                            links += linkTemplate.replace("$linkName$", "GitHub")
                                     .replace("$href$", project[name].links.github);
                        if (project[name].links.hosted)
                            links += linkTemplate.replace("$linkName$", "Hosted")
                                     .replace("$href$", project[name].links.hosted);
                        if (project[name].links.demo)
                            links += linkTemplate.replace("$linkName$", "Demo")
                                     .replace("$href$", project[name].links.demo);
                    
                        images = "";
                        images += imageTemplate.replace("$imagepath$", project[name].images.main);
                        for (let image of project[name].images.slides) {
                            images += imageTemplate.replace("$imagepath$", image);
                        }

                        component = template
                                    .replace("$id$", projID2)
                                    .replace("$images$", images)
                                    .replace("$name$", name)
                                    .replace("$description$", project[name].desc)
                                    .replace("$link$", links)
                                    .replace("$techstack$", tech);
                    
                        filterProjectsDisplay.innerHTML += component;
                    
                        projID2 += 1;
                        displayed.push(project);
                    }
                }
                filterProjectsDisplay.lastElementChild.classList.add('hidden');

                let project;
                for (let i = 1; i <= projID2; i++) {
                    project = document.querySelector('#proj-' + i);
                    const leftBtn = project.querySelector('.left-btn');
                    const rightBtn = project.querySelector('.right-btn');
                    const expandBtn = project.querySelector('.expand');
                    const slides = project.querySelector('.slides');

                    slideshow(slides, leftBtn, rightBtn, expandBtn);
                }
            }
            else {
                filterProjects.classList.add('hidden');
                document.querySelector('#allProjects').classList.remove('hidden');
                foot.classList.remove('hidden');
            }
        }

        let option;
        for (let tech of Object.keys(techList).sort()) {
            option = optionTemplate
                     .replaceAll('$tech$', tech);
            dropdown.innerHTML += option;
        }

        dropdown.addEventListener("change", () => {
            button.disabled = false;
        });
        button.addEventListener('click', () => {
            let tech = dropdown.value;
            let temp = true;
            for (let value of currentFilter) {
                if (tech === value) {
                    temp = false;
                    break;
                }
            }
            if (temp)
                currentFilter = [tech, ...currentFilter];

            updateFilters();
        });
    }

    filter();


    let project;
    for (let i = 1; i <= number; i++) {
        project = document.querySelector('#proj-' + i);
        const leftBtn = project.querySelector('.left-btn');
        const rightBtn = project.querySelector('.right-btn');
        const expandBtn = project.querySelector('.expand');
        const slides = project.querySelector('.slides');

        slideshow(slides, leftBtn, rightBtn, expandBtn);
    }
}

function showGeneral() {
    const contact = document.querySelector('#contact');
    const home = document.querySelector("#home");
    // TODO
    document.title = data.general.name + " - Portfolio";
    document.querySelector('#name').innerHTML = data.general.name;
    home.querySelector('#shortintro').innerHTML = data.general.shortIntro;

    home.querySelector('#resume').addEventListener("click", () => {
        window.location.href = "./data/" + data.general.resume;
    });
    const mailLink = contact.querySelector('#mail-link');
    mailLink.href = 'mailto:' + data.general.contact.email;
    mailLink.querySelector('span').innerHTML += data.general.contact.email;

    socialIcons = {
        facebook: `<a href="$link$" class="social group">
                        <svg viewBox="0 0 512 512">
                        <path d="M211.9 197.4h-36.7v59.9h36.7V433.1h70.5V256.5h49.2l5.2-59.1h-54.4c0 0 0-22.1 0-33.7 0-13.9 2.8-19.5 16.3-19.5 10.9 0 38.2 0 38.2 0V82.9c0 0-40.2 0-48.8 0 -52.5 0-76.1 23.1-76.1 67.3C211.9 188.8 211.9 197.4 211.9 197.4z"/>
                        </svg>
                    </a>`,
        linkedin: `<a href="$link$" class="social group">
                        <svg viewBox="0 0 512 512">
                            <path d="M186.4 142.4c0 19-15.3 34.5-34.2 34.5 -18.9 0-34.2-15.4-34.2-34.5 0-19 15.3-34.5 34.2-34.5C171.1 107.9 186.4 123.4 186.4 142.4zM181.4 201.3h-57.8V388.1h57.8V201.3zM273.8 201.3h-55.4V388.1h55.4c0 0 0-69.3 0-98 0-26.3 12.1-41.9 35.2-41.9 21.3 0 31.5 15 31.5 41.9 0 26.9 0 98 0 98h57.5c0 0 0-68.2 0-118.3 0-50-28.3-74.2-68-74.2 -39.6 0-56.3 30.9-56.3 30.9v-25.2H273.8z"/>
                        </svg>
                    </a>`,
        instagram: `<a href="$link$" class="social group">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 551.034 551.034" style="enable-background:new 0 0 551.034 551.034;" xml:space="preserve">
                            <path d="M386.878,0H164.156C73.64,0,0,73.64,0,164.156v222.722 c0,90.516,73.64,164.156,164.156,164.156h222.722c90.516,0,164.156-73.64,164.156-164.156V164.156 C551.033,73.64,477.393,0,386.878,0z M495.6,386.878c0,60.045-48.677,108.722-108.722,108.722H164.156 c-60.045,0-108.722-48.677-108.722-108.722V164.156c0-60.046,48.677-108.722,108.722-108.722h222.722 c60.045,0,108.722,48.676,108.722,108.722L495.6,386.878L495.6,386.878z"/>
                            <path d="M275.517,133C196.933,133,133,196.933,133,275.516 s63.933,142.517,142.517,142.517S418.034,354.1,418.034,275.516S354.101,133,275.517,133z M275.517,362.6 c-48.095,0-87.083-38.988-87.083-87.083s38.989-87.083,87.083-87.083c48.095,0,87.083,38.988,87.083,87.083 C362.6,323.611,323.611,362.6,275.517,362.6z"/>
                            <circle cx="418.306" cy="134.072" r="34.149"/>
                        </svg>
                    </a>`,
        twitter: `<a href="$link$" class="social group">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
                        <path d="M 50.0625 10.4375 C 48.214844 11.257813 46.234375 11.808594 44.152344 12.058594 C 46.277344 10.785156 47.910156 8.769531 48.675781 6.371094 C 46.691406 7.546875 44.484375 8.402344 42.144531 8.863281 C 40.269531 6.863281 37.597656 5.617188 34.640625 5.617188 C 28.960938 5.617188 24.355469 10.21875 24.355469 15.898438 C 24.355469 16.703125 24.449219 17.488281 24.625 18.242188 C 16.078125 17.8125 8.503906 13.71875 3.429688 7.496094 C 2.542969 9.019531 2.039063 10.785156 2.039063 12.667969 C 2.039063 16.234375 3.851563 19.382813 6.613281 21.230469 C 4.925781 21.175781 3.339844 20.710938 1.953125 19.941406 C 1.953125 19.984375 1.953125 20.027344 1.953125 20.070313 C 1.953125 25.054688 5.5 29.207031 10.199219 30.15625 C 9.339844 30.390625 8.429688 30.515625 7.492188 30.515625 C 6.828125 30.515625 6.183594 30.453125 5.554688 30.328125 C 6.867188 34.410156 10.664063 37.390625 15.160156 37.472656 C 11.644531 40.230469 7.210938 41.871094 2.390625 41.871094 C 1.558594 41.871094 0.742188 41.824219 -0.0585938 41.726563 C 4.488281 44.648438 9.894531 46.347656 15.703125 46.347656 C 34.617188 46.347656 44.960938 30.679688 44.960938 17.09375 C 44.960938 16.648438 44.949219 16.199219 44.933594 15.761719 C 46.941406 14.3125 48.683594 12.5 50.0625 10.4375 Z"> </path>
                    </svg>
                </a>`,
        github: `<a href="$link$" class="social group">
                    <svg viewBox="71 71 370 370">
                        <path d="M256 70.7c-102.6 0-185.9 83.2-185.9 185.9 0 82.1 53.3 151.8 127.1 176.4 9.3 1.7 12.3-4 12.3-8.9V389.4c-51.7 11.3-62.5-21.9-62.5-21.9 -8.4-21.5-20.6-27.2-20.6-27.2 -16.9-11.5 1.3-11.3 1.3-11.3 18.7 1.3 28.5 19.2 28.5 19.2 16.6 28.4 43.5 20.2 54.1 15.4 1.7-12 6.5-20.2 11.8-24.9 -41.3-4.7-84.7-20.6-84.7-91.9 0-20.3 7.3-36.9 19.2-49.9 -1.9-4.7-8.3-23.6 1.8-49.2 0 0 15.6-5 51.1 19.1 14.8-4.1 30.7-6.2 46.5-6.3 15.8 0.1 31.7 2.1 46.6 6.3 35.5-24 51.1-19.1 51.1-19.1 10.1 25.6 3.8 44.5 1.8 49.2 11.9 13 19.1 29.6 19.1 49.9 0 71.4-43.5 87.1-84.9 91.7 6.7 5.8 12.8 17.1 12.8 34.4 0 24.9 0 44.9 0 51 0 4.9 3 10.7 12.4 8.9 73.8-24.6 127-94.3 127-176.4C441.9 153.9 358.6 70.7 256 70.7z"/>
                    </svg>
                </a>`,
        gitlab: `<a href="$link$" class="social group">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
                        <path d="M 38.011719 4 C 37.574219 3.996094 37.183594 4.273438 37.046875 4.691406 L 32.074219 20 L 17.925781 20 L 12.953125 4.691406 C 12.820313 4.289063 12.449219 4.011719 12.023438 4 C 11.597656 3.992188 11.214844 4.25 11.0625 4.648438 L 5.070313 20.640625 C 5.066406 20.640625 5.066406 20.644531 5.0625 20.648438 L 2.0625 28.648438 C 1.90625 29.070313 2.046875 29.542969 2.414063 29.808594 L 24.40625 45.800781 L 24.410156 45.808594 C 24.414063 45.808594 24.414063 45.808594 24.414063 45.8125 C 24.425781 45.820313 24.441406 45.828125 24.453125 45.835938 C 24.46875 45.84375 24.480469 45.855469 24.496094 45.863281 C 24.5 45.863281 24.5 45.867188 24.503906 45.867188 C 24.503906 45.867188 24.507813 45.871094 24.511719 45.871094 C 24.515625 45.875 24.519531 45.878906 24.527344 45.878906 C 24.53125 45.882813 24.539063 45.886719 24.542969 45.890625 C 24.5625 45.898438 24.585938 45.910156 24.609375 45.917969 C 24.609375 45.917969 24.609375 45.917969 24.609375 45.921875 C 24.632813 45.929688 24.65625 45.9375 24.675781 45.945313 C 24.679688 45.945313 24.679688 45.945313 24.683594 45.949219 C 24.699219 45.953125 24.714844 45.957031 24.734375 45.964844 C 24.742188 45.964844 24.75 45.96875 24.761719 45.96875 C 24.761719 45.972656 24.761719 45.972656 24.761719 45.96875 C 24.78125 45.976563 24.800781 45.980469 24.820313 45.984375 C 24.847656 45.988281 24.871094 45.992188 24.898438 45.996094 C 24.9375 45.996094 24.980469 46 25.019531 46 C 25.058594 45.996094 25.09375 45.996094 25.128906 45.988281 C 25.144531 45.988281 25.15625 45.988281 25.171875 45.984375 C 25.171875 45.984375 25.175781 45.984375 25.179688 45.984375 C 25.1875 45.980469 25.191406 45.980469 25.199219 45.980469 C 25.203125 45.980469 25.207031 45.976563 25.214844 45.976563 C 25.222656 45.972656 25.234375 45.972656 25.242188 45.96875 C 25.257813 45.964844 25.269531 45.960938 25.28125 45.957031 C 25.289063 45.957031 25.292969 45.957031 25.296875 45.953125 C 25.300781 45.953125 25.304688 45.953125 25.308594 45.953125 C 25.324219 45.945313 25.34375 45.9375 25.359375 45.933594 C 25.378906 45.925781 25.394531 45.917969 25.410156 45.910156 C 25.414063 45.910156 25.414063 45.910156 25.417969 45.90625 C 25.421875 45.90625 25.425781 45.90625 25.429688 45.902344 C 25.4375 45.898438 25.445313 45.894531 25.453125 45.890625 C 25.476563 45.878906 25.496094 45.867188 25.515625 45.855469 C 25.523438 45.851563 25.527344 45.847656 25.53125 45.84375 C 25.535156 45.84375 25.539063 45.839844 25.542969 45.839844 C 25.558594 45.828125 25.574219 45.820313 25.589844 45.808594 L 25.597656 45.796875 L 47.589844 29.808594 C 47.953125 29.542969 48.09375 29.070313 47.9375 28.648438 L 44.945313 20.675781 C 44.941406 20.667969 44.9375 20.65625 44.9375 20.648438 L 38.9375 4.648438 C 38.789063 4.261719 38.425781 4.003906 38.011719 4 Z M 11.933594 8.027344 L 15.824219 20 L 7.445313 20 Z M 38.066406 8.027344 L 42.558594 20 L 34.175781 20 Z M 8.066406 22 L 16.472656 22 L 22.328125 40.015625 Z M 18.578125 22 L 31.421875 22 L 25 41.765625 Z M 33.527344 22 L 41.933594 22 L 27.671875 40.015625 Z M 6.3125 23.007813 L 19.6875 39.902344 L 4.203125 28.640625 Z M 43.6875 23.007813 L 45.796875 28.640625 L 30.3125 39.902344 Z"></path>
                    </svg>
                </a>`,
        telegram: `<a href="$link$" class="social group">
                        <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
                            <path d="M 500 0C 224 0 0 224 0 500C 0 776 224 1000 500 1000C 776 1000 1000 776 1000 500C 1000 224 776 0 500 0C 500 0 500 0 500 0 M 185 525C 185 525 185 525 185 525C 244 492 309 465 370 438C 476 394 581 350 688 309C 709 302 746 296 750 326C 748 370 740 413 734 457C 720 552 703 647 687 742C 681 774 642 790 616 770C 555 729 494 688 434 646C 414 626 432 597 450 583C 500 533 553 491 601 439C 614 408 576 434 563 442C 495 490 428 540 355 581C 318 602 275 584 238 573C 205 559 156 546 185 525C 185 525 185 525 185 525"/>
                        </svg> 
                    </a>`,
        whatsapp: `<a href="$link$" class="social group">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 308 308" xml:space="preserve">
                            <path d="M227.904,176.981c-0.6-0.288-23.054-11.345-27.044-12.781c-1.629-0.585-3.374-1.156-5.23-1.156 c-3.032,0-5.579,1.511-7.563,4.479c-2.243,3.334-9.033,11.271-11.131,13.642c-0.274,0.313-0.648,0.687-0.872,0.687 c-0.201,0-3.676-1.431-4.728-1.888c-24.087-10.463-42.37-35.624-44.877-39.867c-0.358-0.61-0.373-0.887-0.376-0.887 c0.088-0.323,0.898-1.135,1.316-1.554c1.223-1.21,2.548-2.805,3.83-4.348c0.607-0.731,1.215-1.463,1.812-2.153 c1.86-2.164,2.688-3.844,3.648-5.79l0.503-1.011c2.344-4.657,0.342-8.587-0.305-9.856c-0.531-1.062-10.012-23.944-11.02-26.348 c-2.424-5.801-5.627-8.502-10.078-8.502c-0.413,0,0,0-1.732,0.073c-2.109,0.089-13.594,1.601-18.672,4.802 c-5.385,3.395-14.495,14.217-14.495,33.249c0,17.129,10.87,33.302,15.537,39.453c0.116,0.155,0.329,0.47,0.638,0.922 c17.873,26.102,40.154,45.446,62.741,54.469c21.745,8.686,32.042,9.69,37.896,9.69c0.001,0,0.001,0,0.001,0 c2.46,0,4.429-0.193,6.166-0.364l1.102-0.105c7.512-0.666,24.02-9.22,27.775-19.655c2.958-8.219,3.738-17.199,1.77-20.458 C233.168,179.508,230.845,178.393,227.904,176.981z"/>
                            <path d="M156.734,0C73.318,0,5.454,67.354,5.454,150.143c0,26.777,7.166,52.988,20.741,75.928L0.212,302.716 c-0.484,1.429-0.124,3.009,0.933,4.085C1.908,307.58,2.943,308,4,308c0.405,0,0.813-0.061,1.211-0.188l79.92-25.396 c21.87,11.685,46.588,17.853,71.604,17.853C240.143,300.27,308,232.923,308,150.143C308,67.354,240.143,0,156.734,0z  M156.734,268.994c-23.539,0-46.338-6.797-65.936-19.657c-0.659-0.433-1.424-0.655-2.194-0.655c-0.407,0-0.815,0.062-1.212,0.188 l-40.035,12.726l12.924-38.129c0.418-1.234,0.209-2.595-0.561-3.647c-14.924-20.392-22.813-44.485-22.813-69.677 c0-65.543,53.754-118.867,119.826-118.867c66.064,0,119.812,53.324,119.812,118.867 C276.546,215.678,222.799,268.994,156.734,268.994z"/>
                        </svg>
                    </a>`,
        signal: `<a href="$link$" class="social group">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
                        <path d="M 25 2 L 24.78125 2.0019531 L 24.796875 4.0019531 L 25 4 C 26.529 4 28.054203 4.1651875 29.533203 4.4921875 L 29.966797 2.5390625 C 28.345797 2.1810625 26.674 2 25 2 z M 22.695312 2.1132812 C 20.955313 2.2872813 19.241656 2.6606562 17.597656 3.2226562 L 18.242188 5.1152344 C 19.741187 4.6022344 21.307531 4.2625156 22.894531 4.1035156 L 22.695312 2.1132812 z M 31.984375 3.0859375 L 31.376953 4.9902344 C 32.893953 5.4762344 34.349078 6.1370312 35.705078 6.9570312 L 36.740234 5.2460938 C 35.250234 4.3450938 33.649375 3.6189375 31.984375 3.0859375 z M 15.648438 3.9921875 C 14.051438 4.7111875 12.545875 5.6147344 11.171875 6.6777344 L 12.394531 8.2597656 C 13.645531 7.2917656 15.015703 6.4694531 16.470703 5.8144531 L 15.648438 3.9921875 z M 38.476562 6.4121094 L 37.285156 8.0195312 C 38.566156 8.9705312 39.727422 10.068203 40.732422 11.283203 L 42.273438 10.009766 C 41.165437 8.6707656 39.887563 7.4591094 38.476562 6.4121094 z M 25 7 C 15.626 7 8 14.178 8 23 C 8 28.129 10.606 32.9265 15 35.9375 L 15 41 C 15 41.357 15.19 41.686234 15.5 41.865234 C 15.654 41.954234 15.827 42 16 42 C 16.172 42 16.344047 41.955234 16.498047 41.865234 L 21.929688 38.738281 C 22.939688 38.912281 23.972 39 25 39 C 34.374 39 42 31.822 42 23 C 42 14.178 34.374 7 25 7 z M 9.578125 8.0371094 C 8.295125 9.2421094 7.1675156 10.594641 6.2285156 12.056641 L 7.9121094 13.136719 C 8.7631094 11.811719 9.7842656 10.586141 10.947266 9.4941406 L 9.578125 8.0371094 z M 25 9 C 33.271 9 40 15.28 40 23 C 40 30.72 33.271 37 25 37 C 23.973 37 22.9415 36.901031 21.9375 36.707031 C 21.7025 36.662031 21.456047 36.702266 21.248047 36.822266 L 17 39.269531 L 17 35.400391 C 17 35.059391 16.825109 34.742594 16.537109 34.558594 C 12.443109 31.941594 10 27.62 10 23 C 10 15.28 16.729 9 25 9 z M 43.529297 11.689453 L 41.869141 12.804688 C 42.757141 14.125688 43.469281 15.54825 43.988281 17.03125 L 45.878906 16.371094 C 45.302906 14.727094 44.511297 13.152453 43.529297 11.689453 z M 5.1855469 13.878906 C 4.3875469 15.450906 3.8005 17.113266 3.4375 18.822266 L 5.3945312 19.238281 C 5.7205312 17.698281 6.24975 16.200203 6.96875 14.783203 L 5.1855469 13.878906 z M 46.466797 18.392578 L 44.519531 18.849609 C 44.838531 20.202609 45 21.6 45 23 C 45 23.184 44.996234 23.366828 44.990234 23.548828 L 46.990234 23.609375 C 46.996234 23.407375 47 23.204 47 23 C 47 21.445 46.819797 19.895578 46.466797 18.392578 z M 3.109375 20.900391 C 3.037375 21.595391 3 22.301 3 23 C 3 24.052 3.0820938 25.109578 3.2460938 26.142578 L 5.2226562 25.830078 C 5.0756563 24.899078 5 23.948 5 23 C 5 22.37 5.0336563 21.733422 5.0976562 21.107422 L 3.109375 20.900391 z M 44.835938 25.4375 C 44.624937 27.0005 44.207703 28.533141 43.595703 29.994141 L 45.441406 30.767578 C 46.120406 29.144578 46.585359 27.441078 46.818359 25.705078 L 44.835938 25.4375 z M 5.6152344 27.683594 L 3.6835938 28.199219 C 4.1335938 29.887219 4.8047344 31.519828 5.6777344 33.048828 L 7.4140625 32.056641 C 6.6270625 30.676641 6.0222344 29.205594 5.6152344 27.683594 z M 42.775391 31.703125 C 42.023391 33.083125 41.092859 34.377828 40.005859 35.548828 L 41.472656 36.908203 C 42.671656 35.615203 43.69925 34.185156 44.53125 32.660156 L 42.775391 31.703125 z M 8.4375 33.65625 L 6.8105469 34.818359 C 7.7425469 36.125359 8.830875 37.330297 10.046875 38.404297 L 10.457031 42.427734 L 12.449219 42.224609 L 11.996094 37.806641 C 11.969094 37.549641 11.844437 37.313484 11.648438 37.146484 C 10.433437 36.113484 9.3535 34.93925 8.4375 33.65625 z M 38.646484 36.876953 C 37.466484 37.924953 36.153094 38.837891 34.746094 39.587891 L 35.6875 41.351562 C 37.2325 40.527563 38.675609 39.524094 39.974609 38.371094 L 38.646484 36.876953 z M 33.023438 40.402344 C 31.562437 41.012344 30.023172 41.454797 28.451172 41.716797 L 28.779297 43.689453 C 30.504297 43.402453 32.191922 42.917047 33.794922 42.248047 L 33.023438 40.402344 z M 22.847656 41.890625 C 22.680656 41.874625 22.499844 41.900703 22.339844 41.970703 L 21.326172 42.419922 L 22.138672 44.248047 L 22.910156 43.904297 C 24.179156 44.019297 25.464078 44.0285 26.705078 43.9375 L 26.558594 41.943359 C 25.341594 42.031359 24.083656 42.015625 22.847656 41.890625 z M 19.5 43.232422 L 14.927734 45.259766 L 15.738281 47.087891 L 20.310547 45.060547 L 19.5 43.232422 z M 12.652344 44.212891 L 10.662109 44.417969 L 11.005859 47.753906 C 11.038859 48.072906 11.222047 48.354625 11.498047 48.515625 C 11.653047 48.605625 11.826 48.650391 12 48.650391 C 12.138 48.650391 12.275297 48.623453 12.404297 48.564453 L 13.910156 47.896484 L 13.099609 46.068359 L 12.853516 46.177734 L 12.652344 44.212891 z"></path>
                    </svg>
                </a>`
    }

    social1 = contact.querySelector('#social1');
    social2 = contact.querySelector('#social2');
    social3 = contact.querySelector('#social3');
    sociallist1 = ["facebook", "linkedin", "instagram", "twitter"];
    sociallist2 = ["github", "gitlab"];
    sociallist3 = ["telegram", "whatsapp", "signal"];

    let element;
    for (let item of sociallist1) {
        if (data.general.contact[item]) {
            element = socialIcons[item]
                      .replace("$link$", data.general.contact[item]);
            social1.innerHTML += element;
        }
    }
    for (let item of sociallist2) {
        if (data.general.contact[item]) {
            element = socialIcons[item]
                      .replace("$link$", data.general.contact[item]);
            social2.innerHTML += element;
        }
    }
    for (let item of sociallist3) {
        if (data.general.contact[item]) {
            element = socialIcons[item]
                      .replace("$link$", data.general.contact[item]);
            social3.innerHTML += element;
        }
    }
}

function showAbout() {
    const section = document.querySelector("#about");

    const dot = `<div class="h-full w-52 flex justify-center items-center">
                    <span class="hidden sm:block rounded-full lg:motion-safe:group-hover:scale-y-[0.91] h-2 w-2 bg-indigo-800"></span>
                </div>`;
    const timeline = section.querySelector('#timeline');
    const events = section.querySelector('#events');

    const additionalTemplate = `<span> <div class="w-1 inline-flex"> <div class="h-1 w-1 relative bottom-[0.15rem] rounded-full bg-white/80"></div> </div>
                                    $data$
                                </span>`;
    const template = `<div class="flex sm:block items-center">
                        <div class="flex flex-col justify-start items-center w-auto sm:w-52 sm:h-auto">
                            <span class="hidden sm:inline-block h-8 w-[2px] my-2 bg-gray-300 rounded-full transform transition duration-200 lg:motion-safe:scale-y-0 lg:motion-safe:group-hover:scale-y-100"></span>
                            <span class=" lg:motion-safe:-translate-y-8 lg:motion-safe:group-hover:translate-y-0 text-yellow-400 font-nunito font-bold $timefontsize$ lg:motion-safe:opacity-80 lg:motion-safe:group-hover:opacity-100 transform lg:motion-safe:group-hover:scale-110 transition duration-200"> $time$ </span>
                            <span class="transform transition duration-300 lg:motion-safe:-translate-y-8 lg:motion-safe:group-hover:translate-y-0 text-center font-nunito $headfontsize$ leading-tight"> $head$ </span>
                            <div class="transform transition duration-300 lg:motion-safe:-translate-y-8 lg:motion-safe:group-hover:translate-y-0 flex text-white/70 items-start">
                                <svg class="fill-transparent stroke-white/70 h-3 w-5 mt-1 stroke-[20]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 395.71 395.71" xml:space="preserve">
                                    <path d="M197.849,0C122.131,0,60.531,61.609,60.531,137.329c0,72.887,124.591,243.177,129.896,250.388l4.951,6.738 c0.579,0.792,1.501,1.255,2.471,1.255c0.985,0,1.901-0.463,2.486-1.255l4.948-6.738c5.308-7.211,129.896-177.501,129.896-250.388 C335.179,61.609,273.569,0,197.849,0z M197.849,88.138c27.13,0,49.191,22.062,49.191,49.191c0,27.115-22.062,49.191-49.191,49.191 c-27.114,0-49.191-22.076-49.191-49.191C148.658,110.2,170.734,88.138,197.849,88.138z"/>
                                </svg>
                                <p class="text-sm leading-tight pl-1"> $place$ </p>
                            </div>
                            <div class="transform transition duration-300 lg:motion-safe:-translate-y-8 lg:motion-safe:group-hover:translate-y-0 mt-1 text-sm italic text-white/90 flex flex-col items-start gap-[0.15rem]">
                                $additional$
                            </div>
                        </div>
                        <span class="sm:hidden w-8 h-[2px] mx-2 bg-gray-300 rounded-full"></span>
                      </div>`;

    let additionalData, element, timeFont, headFont;
    for (let item of data.about.history) {
        timeline.innerHTML += dot;
        additionalData = "";
        for (let data of item.additional) {
            additionalData += additionalTemplate
                              .replace("$data$", data);
        }
        if (item.timeline.length > 6)
            timeFont = "text-2xl";
        else timeFont = "text-4xl";
        if (item.head.length > 40)
            headFont = "";
        else headFont = "text-lg";
        element = template
                  .replace("$time$", item.timeline)
                  .replace("$timefontsize$", timeFont)
                  .replace("$head$", item.head)
                  .replace("$headfontsize$", headFont)
                  .replace("$place$", item.place)
                  .replace("$additional$", additionalData);
        events.innerHTML += element;
    }

    section.querySelector('#bio').innerHTML = data.about.bio;

    const achievements = section.querySelector('#achievements');
    const achievementsTemplate = `<p class="leading-tight"> <div class="w-3 mr-2 inline-flex"> <div class="h-1 w-3 relative bottom-[0.2rem] rounded-full bg-white/60"></div> </div>
                                      $achievement$
                                  </p>`;
    
    if (data.about.achievements.length == 0) {
        achievements.classList.add('hidden');
        achievements.parentElement.classList.add('justify-center');
    }
    else {
        for (let achievement of data.about.achievements) {
            element = achievementsTemplate
                      .replace("$achievement$", achievement);
            achievements.innerHTML += element;
        }
        achievements.parentElement.classList.add('justify-between');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    load("general", showGeneral);
    load("skills", showSkills);
    load("projects", showProjects);
    load("about", showAbout);
    hello();

    const nav = document.querySelector('#nav');
    document.querySelector('#menu').addEventListener("click", () => {
        nav.classList.toggle("hidden");
    });
    const content = document.querySelector('#content');
    content.addEventListener("click", () => {
        nav.classList.add("hidden");
        if (expanded)
            expanded.classList.remove('hidden');
    });

    const navButtons = document.querySelectorAll(".nav-btn, #home-btn");
    for (let btn of navButtons) {
        btn.addEventListener("click", () => {
            nav.classList.add("hidden");
        });
    }

    const home = document.querySelector("#home");
    const skills = document.querySelector("#skills");
    const projects = document.querySelector("#projects");
    const about = document.querySelector("#about");
    const contact = document.querySelector("#contact");
    
    var currentElement = 0;

    document.querySelector('#skills-btn').addEventListener("click", () => {
        content.scrollTop = skills.offsetTop;
        currentElement = 1;
    })

    document.querySelector('#projects-btn').addEventListener("click", () => {
        content.scrollTop = projects.offsetTop;
        currentElement = 2;
    })

    document.querySelector('#about-btn').addEventListener("click", () => {
        content.scrollTop = about.offsetTop;
        currentElement = 3;
    })

    document.querySelector('#contact-btn').addEventListener("click", () => {
        content.scrollTop = contact.offsetTop;
        currentElement = 4;
    })


    // Scroll snap with JS
    // const scrollContainer = document.querySelector('.scroll-y-container');
    // const scrollElements = document.querySelectorAll('.scroll-y');
    // const nextPos = () => (currentElement + 1) % scrollElements.length;
    // let scrolling = false;

    // scrollContainer.addEventListener('wheel', (event) => {
    //     scrolling = true;
    // });

    // setInterval(() => {
    //     if (scrolling) {
    //         scrolling = false;
    //         // place the scroll handling logic here
    //         scrollContainer.scrollTo(0, scrollElements[nextPos()].offsetTop);
    //         currentElement = nextPos();
    //     }
    // },200);
    

    // On scroll animations
    // scrollAnimate(".fade-l-scroll", "motion-safe:animate-fade-l");
    // scrollAnimate(".fade-r-scroll", "motion-safe:animate-fade-r");
    // scrollAnimate(".fade-b-scroll", "motion-safe:animate-fade-b");
});