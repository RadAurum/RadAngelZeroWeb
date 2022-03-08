import React, { useState } from "react"
import { t } from 'i18next'
import { height } from "@mui/system";
const blacklist = ['Spotify', 'Visual Studio Code', 'Twitch', 'Google Play'];
const watchlist = ['Twitch', 'YouTube']

export default function Activity({ activity }) {
    const [rand, setRand] = useState(Math.round(Math.random() * 1));
    const [gameImage, setGameImage] = useState('')
    console.log(activity)

    const VSCTitleAccompaniment = () => {
        switch (rand) {
            case 0:
                return t(`about.activity.VisualStudioCode.titleAccompaniment.writingCode`)
            case 1:
                return t(`about.activity.VisualStudioCode.titleAccompaniment.doingMagic`)
            default:
                break;
        }
    }

    if (!activity.assets && !blacklist.includes(activity.name)) {
        const searchWikis = new XMLHttpRequest();
        searchWikis.open("GET", `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${activity.name}&format=json&origin=*`);
        searchWikis.send();
        searchWikis.onreadystatechange = (wikisResult) => {
            if (wikisResult.target.readyState === 4 && wikisResult.target.status === 200) {
                console.log(JSON.parse(searchWikis.response))
                let title = JSON.parse(searchWikis.response).query.search[0].title
                const getWiki = new XMLHttpRequest();
                getWiki.open("GET", `https://en.wikipedia.org/w/rest.php/v1/page/${title}`);
                getWiki.send();
                getWiki.onreadystatechange = (wiki) => {
                    if (wiki.target.readyState === 4 && wiki.target.status === 200) {
                        let wikiContent = JSON.parse(getWiki.response).source.split('\n');
                        wikiContent.every((element) => {
                            if (element.includes('image')) {
                                const getWikiImage = new XMLHttpRequest();
                                getWikiImage.open("GET", `https://en.wikipedia.org/w/api.php?action=query&titles=Image:${element.split(' = ')[1].replace('File:', '')}&prop=imageinfo&iiprop=url&format=json&origin=*`);
                                getWikiImage.send();
                                getWikiImage.onreadystatechange = (wikiImage) => {
                                    if (wikiImage.target.readyState === 4 && wikiImage.target.status === 200) {
                                        let wikiPage = JSON.parse(getWikiImage.response).query.pages;
                                        setGameImage(wikiPage[Object.keys(wikiPage)[0]].imageinfo[0].url)
                                    }
                                }
                                return false;
                            }
                            return true;
                        });
                    }
                }
            }
        }

    }


    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignSelf: 'center',
            width: '80%',
            backgroundColor: '#2c2c2c',
            padding: '2vw',
            borderRadius: '2vh',
            border: '8px solid #9e00ff',
            margin: '20px 0px'
        }}>
            {((activity.assets ? !activity.assets.largeText.toLowerCase().includes('premid') : true) && !blacklist.includes(activity.name)) &&
                <div>
                    <h2>
                        {t(`about.activity.type.${activity.type}`)} {activity.name}
                    </h2>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row'
                    }}>
                        <img src={gameImage} alt={`${t('about.activity.Game.coverOf')} ${activity.name}`}
                            style={{
                                width: '20%',
                                objectFit: 'contain'
                            }} />
                    </div>
                </div>
            }
            {activity.name === 'Spotify' &&
                <div>
                    <h2>
                        {activity.name}
                    </h2>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row'
                    }}>
                        <img src={activity.assets.largeImageURL} alt={`${t('about.activity.Spotify.coverOf')} ${activity.assets.largeText}`}
                            style={{
                                width: '20%',
                                objectFit: 'contain'
                            }} />
                        <div style={{ width: '2%' }} />
                        <div>
                            <h3 style={{
                                marginBlock: '0px'
                            }}>
                                {activity.details}
                            </h3>
                            <h4>{activity.state.replace(/;/g, ',')}</h4>
                            <h5>{activity.assets.largeText}</h5>
                        </div>
                    </div>
                </div >
            }
            {activity.name === 'Visual Studio Code' &&
                <div>
                    <h2>
                        {VSCTitleAccompaniment()} {activity.name}
                    </h2>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row'
                    }}>
                        <img src={activity.assets.largeImageURL} alt={`${t('about.activity.Spotify.coverOf')} ${activity.assets.largeText}`}
                            style={{
                                width: '20%',
                                objectFit: 'contain',
                                borderRadius: '10%'
                            }} />
                        <div style={{ width: '2%' }} />
                        <div>
                            <h3 style={{
                                marginBlock: '0px'
                            }}>
                                {t(`about.activity.VisualStudioCode.editing`)} {activity.details.split(' ').pop()}
                            </h3>
                            <h4>{t(`about.activity.VisualStudioCode.workspace`)} {activity.state.split(' ').pop()}</h4>
                            <h5>{t(`about.activity.VisualStudioCode.edtitingFile`, { fileType: activity.assets.largeText.split(' ')[2] })}</h5>
                        </div>
                    </div>
                </div>
            }
            {(activity.assets ? activity.assets.largeText.toLowerCase().includes('premid') : false) &&
                <div>
                    <h2>
                        {watchlist.includes(activity.name) && t(`about.activity.type.WATCHING`)} {activity.name}
                    </h2>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row'
                    }}>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '20%',
                            objectFit: 'contain',
                        }}>
                            <img src={activity.assets.largeImageURL} alt={`${t('about.activity.Spotify.coverOf')} ${activity.assets.largeText}`}
                                style={{
                                    width: '100%',
                                    objectFit: 'contain',
                                    borderRadius: '10%'
                                }} />
                            {activity.assets.smallText &&
                                <div style={{
                                    display: 'flex',
                                    backgroundColor: '#2c2c2c',
                                    // backgroundColor: '#f0f',
                                    width: '4vw',
                                    height: '4vw',
                                    borderRadius: '50%',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginTop: '-3.4vw',
                                    marginRight: '-0.8vw',
                                    marginLeft: 'auto'

                                }}>
                                    {activity.assets.smallText === 'Live' &&
                                        // <div style={{
                                        //     backgroundColor: '#f00',
                                        //     width: '60%',
                                        //     height: '60%',
                                        //     borderRadius: '50%'
                                        // }} />
                                        <img src={activity.assets.smallImageURL} alt={`${t('about.activity.Spotify.coverOf')} ${activity.assets.smallImageURL}`}
                                            style={{
                                                width: '125%',
                                                height: '125%',
                                                objectFit: 'contain',
                                                borderRadius: '10%'
                                            }} />
                                    }
                                </div>
                            }
                        </div>

                        <div style={{ width: '2%' }} />
                        <div>
                            <h3 style={{
                                marginBlock: '0px'
                            }}>
                                {activity.details}
                            </h3>
                            <h4>{activity.state}</h4>
                            <h5>{activity.assets.smallText}</h5>
                        </div>
                    </div>
                </div >
            }
        </div>
    )
}