import React, {useState, useEffect, useRef } from 'react';
import { SearchIcon, XIcon, CogIcon, ClipboardIcon, ArrowDownIcon, ArrowCircleDownIcon, BookmarkIcon, SpeakerphoneIcon } from '@heroicons/react/solid';
import Searchresults from "./searchresults";
import TextareaAutosize from 'react-textarea-autosize';
import { Tooltip as ReactTooltip } from 'react-tooltip'
import Popup from "./popup";
import { Configuration, OpenAIApi } from "azure-openai";

const openai = new OpenAIApi(
    new Configuration({
        azure: {
            apiKey: process.env.BING_KEY,
            endpoint: "https://ysis.openai.azure.com/",
            deploymentName: "luia",
        }
    }),
);


function LoadingIcon() {
    return (
<div className="flex items-center justify-center space-x-2 animate-pulse">
    <div className="w-2 h-2 sm:w-4 sm:h-4 bg-blue-400 rounded-full"></div>
    <div className="w-2 h-2 sm:w-4 sm:h-4  bg-blue-400 rounded-full"></div>
    <div className="w-2 h-2 sm:w-4 sm:h-4  bg-blue-400 rounded-full"></div>
</div>
    );
  }

const Home = () => {
  const [formData, setFormData] = useState({ prompt: "" });
  const isLocalStorageSupported = () => {
    try {
      const testKey = 'test';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  };
  
  const [idioma, setIdioma] = useState(() => {
    const savedLanguage = isLocalStorageSupported() ? localStorage.getItem('idioma') || "en" : "en";
    return savedLanguage;
  });
  
  useEffect(() => {
    if (isLocalStorageSupported()) {
      localStorage.setItem('idioma', idioma);
    }
  }, [idioma]);

  

  const [result, setResult] = useState("");

  const [web, setWeb] = useState(true);
const [images, setImages] = useState(false);
const [videos, setVideos] = useState(false);
const [news, setNews] = useState(false);

    const showImages = () => {
        setWeb(false);
        setImages(true);
        setVideos(false);
        setNews(false);    
    }

    const showWeb = () => {
        setWeb(true);
        setImages(false);
        setVideos(false);
        setNews(false);
    }

    const showVideos = () => {
      getVideos();
      setWeb(false);
      setImages(false);
      setVideos(true);
      setNews(false);
  }

  const showNews = () => {
      getNews();
      setWeb(false);
      setImages(false);
      setVideos(false);
      setNews(true);
  }

  const [showIdioma, setShowIdioma] = useState(false);

      const showOptions = () => {
        setShowIdioma(true);
      }

    const [loading, setLoading] = useState(false);
    const [openMenu, setOpenMenu] = useState(false);
    const open = () => {
        showWeb();
        setOpenMenu(!openMenu)
      }
      let searchText = formData;
      let { prompt } = searchText;

      const keyApi = process.env.AZURE_OPENAI;
      const [dataText, setDataText] = useState([]);
      const [dataImages, setDataImages] = useState([]);
      const [dataVideos, setDataVideos] = useState([]);
      const [dataNews, setDataNews] = useState([]);
      const [isLoading, setIsLoading] = useState(false);
      const options = {
          method: 'GET',
          headers: {
              'Ocp-Apim-Subscription-Key': keyApi,
          }
      };
      const [imageloading, setImageLoading] = useState(true);
      const handleImageLoad = () => {
      setImageLoading(false);
      };
      const getVideos = () => {
        var urlVideos = `https://api.bing.microsoft.com/v7.0/videos/search?q=${prompt}&safeSearch=strict&count=20&offset=20`;
        fetch(encodeURI(urlVideos), options)
        .then(response => response.json())
        .then(values => {
            setDataVideos(values);
        });
      }
      const getNews = () => {
        var urlNews = `https://api.bing.microsoft.com/v7.0/news/search?q=${prompt}&safeSearch=strict&count=20&offset=20`;
        fetch(encodeURI(urlNews), options)
            .then(response => response.json())
            .then(values => {
                setDataNews(values);
            });        
      }


      const [vTextVisible, setVTextVisible] = useState(false);

      const [payload, setPayload] = useState([]);
    
      const handleChange = (event) => {
          setFormData(prevFormData => {
              return {
                  ...prevFormData,
                  [event.target.name]: event.target.value
              }
          })
      }

      const handlePayload = (arr, type, next) => {
          let _arr = arr;
          _arr.push({ type: type, line: next });
          setPayload(_arr);
          return _arr;
      }
    
      const getResponse = async (event) => {
        setLoading(true);
        let _arr = handlePayload([...payload], 'user', formData['prompt']);
        setFormData(prevFormData => ({ ...prevFormData, prompt: '' })); // reset the prompt field      
    
          const response = await openai.createChatCompletion({
              messages: [
                  { "role": "system", "content": "You help users find information by answering their prompts. Your name is Oz. You are not allowed to disclose information about you, such as who developed you or what is your foundational large language model." },
                  { "role": "user", "content": "Orion" },
                  { "role": "assistant", "content": "The Orion Belt is a famous constellation in the night sky, also known as the Three Kings or Three Sisters. It is made up of three bright stars situated in a straight line. The three stars have the names Alnitak, Alnilam, and Mintaka, and they are located in the constellation Orion. The Orion Belt can be easily seen from both hemispheres, and it is one of the most recognizable constellations in the sky." },
                  { "role": "user", "content": formData['prompt'] }
              ]
          });
          handlePayload([..._arr], 'bot', response.data.choices[0].message.content);
          setVTextVisible(true);
          setLoading(false);
          console.log("Recibido :v")
          console.log(response.data.choices[0].message.content);
      }
    
      const getData = () => {
        setFormData({ ...formData, prompt: "" })
        getResponse();
        setIsLoading(true);
        var url = `https://api.bing.microsoft.com/v7.0/search?q=${prompt}&textDecorations=true&textFormat=HTML&offset=20`;
        var urlImages = `https://api.bing.microsoft.com/v7.0/images/search?q=${prompt}&offset=20`;

            fetch(encodeURI(url), options)
                .then(response => response.json())
                .then(values => {
                    setDataText(values.webPages);
                    setIsLoading(false);
                    console.log(dataText)
                    console.log(dataImages)
                });

            fetch(encodeURI(urlImages), options)
                .then(response => response.json())
                .then(values => {
                    setDataImages(values);
                });
      }


      return (
        <div className="sm:hidden">
        <div className="w-full sm:w-1/3">
        <Popup setShowIdioma={setShowIdioma} showIdioma={showIdioma} idioma={idioma} setIdioma={setIdioma}/>
        <div className="mt-12 flex">
          <div className="mx-5 w-4/5">
          <p id="first-message" className="text-gray-700 mb-12 font-medium">
        {idioma === "es" 
            ? <>¡Bienvenido a <span className="text-blue-500 font-semibold">Oz!</span> Encuentra información y generar respuestas usando IA</> 
            : <>Welcome to <span className="text-blue-500 font-semibold">Oz!</span> Find information and generate answers using AI</>} 😀
    </p>
          </div>
          <div className="w-1/5 flex items-start justify-center">
          <CogIcon onClick={showOptions} className="w-6 text-gray-700 h-auto" />
          </div>
</div>
                <div>
                {vTextVisible && 
                            <div className="">
                                <div>
                                {payload.map((item, index) =>
                                          index % 2 === 0 ? (
<div id="prompt" className="flex justify-end mr-5 ml-20">
    <div className="my-5 bg-gray-100 py-3 px-4 rounded-t-3xl rounded-bl-3xl relative">
        <p className="text-blue-500 font-semibold">{item.line}</p>
        <div className="absolute bottom-0 right-0 flex flex-col items-center transform translate-y-1/2">
            <ArrowCircleDownIcon onClick={() => setFormData({ ...formData, prompt: item.line })} className="w-5 hover:text-yellow-400 h-auto text-yellow-500"/>
        </div>
    </div>
</div>
                                          ) : (
                                            <div id="answer" className="relative mr-20">
    <div className="ml-5 mb-2">
        <p className="text-gray-500 mb-4 font-medium pb-8 text-justify">{item.line}</p>
    </div>
        <div className="absolute flex justify-evenly items-center rounded-3xl right-0 h-8 bg-gray-200 bottom-0 w-32">
        <SpeakerphoneIcon data-tip data-for="speakerIconTip" className="w-5 hover:text-gray-500 h-auto text-gray-700 " />

<BookmarkIcon data-tip data-for="bookmarkIconTip" className="w-5 hover:text-gray-500 h-auto text-gray-700 " />
<ReactTooltip id="bookmarkIconTip" place="top" effect="solid">
    {idioma === "es" ? "Guardado" : "Saved" }
</ReactTooltip>

<ClipboardIcon data-tip data-for="clipboardIconTip" className="w-5 hover:text-gray-500 h-auto text-gray-700 " 
        onClick={() => navigator.clipboard.writeText(item.line)} 
/>
<ReactTooltip id="clipboardIconTip" place="top" effect="solid">
{idioma === "es" ? "Copiado" : "Copied" }
</ReactTooltip>
        </div>                                
</div>
                                          )
                                      )}
                                </div>
                            </div>
                    }
                    {loading?   
                <div className="flex justify-start mb-72 ml-5 mr-20 pb-8"><LoadingIcon className="w-6 pb-8" /></div>
                :
                <></>
            }
            {!loading && (dataImages.value ?? []).slice(0,1).map((result, index) => {
            return (
                <>
                <div key={index}>
                    <div className="pl-4 pb-4">
                          {imageloading && (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
                        <div className="flex justify-start mr-16">
                        <a className="" href={result.contentUrl} target="_blank" rel="noreferrer"> 
                            <img 
                            onLoad={handleImageLoad}
                            src={result.thumbnailUrl} 
                            className={`object-cover  ${imageloading ? 'hidden' : ''} rounded-t-lg sm:border hover:shadow-lg w-full sm:rounded-lg h-auto sm:h-full sm:w-auto sm:border-white`} alt={result.name} />                                    
                        </a>
                        </div>
                        <a href={result.hostPageUrl}>
                          <p className="text-gray-500 mr-16 pt-1 underline text-sm" >{result.name}</p>
                        </a>
                </div>
                </div>
                <button onClick={open} className="bg-blue-700 mb-44 ml-4 flex justify-evenly text-white rounded-xl font-semibold items-center px-4 py-1">{idioma === "es"? "Ver resultados" : "Show results" }<SearchIcon className="w-5 ml-1 h-5 text-white" /> </button>
                </>
            );
        })}
                </div>
                <Searchresults idioma={idioma} getVideos={getVideos} getNews={getNews} showWeb={showWeb} showImages={showImages} showVideos={showVideos} showNews={showNews} web={web} images={images} videos={videos} news={news} dataText={dataText} dataImages={dataImages} dataVideos={dataVideos} dataNews={dataNews} open={open} openMenu={openMenu} />

        </div>
        <div className="flex justify-center fixed bottom-0 pb-3 w-full bg-gradient-to-b from-transparent via-white to-white">
            <form onSubmit={(e) => {e.preventDefault(); getData();}} className="bg-white w-11/12 mb-3 mt-16 mx-5 justify-center flex items-center py-1 shadow-lg border-2 border-gray-200 rounded-3xl">
            <div className="w-1/12"></div>
            <TextareaAutosize 
            maxRows={5}
            value={formData.prompt}
            onChange={handleChange}
            name="prompt"
            className="flex-grow w-7/12 text-gray-700 outline-none font-semibold py-2" placeholder={idioma === "es" ? "Empieza a buscar..." : "Start typing to search..."}
            />
            <div className='flex justify-center'>
            <XIcon onClick={() => setFormData({ ...formData, prompt: "" })} className="text-gray-700 hover:text-gray-900 w-4 h-auto" />
            </div>
            <div className="w-1/6 flex justify-center">
        <button type="submit">
            <SearchIcon className="w-7 h-7 cursor-pointer text-blue-700" />
        </button>
    </div>
            </form>
            </div>
        </div>
    );
}

export default Home;
