import React, { useState, useEffect, useContext } from 'react';
import { PlaylistContainer, CardPlaylist, CardMusic, ContainerList, GridContainPlaylist, GridItemPlaylist, IconButtonPlay, MenuIconChangeMusic } from '../style'
import { Text, Button, Dflex } from '../../../stylesGlobaly/globalComponents'
import { getPlaylistByIdUser, modifyPlaylistMusics } from "../../../services/PlaylistService"
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import arrayMove from 'array-move'
import { playlistsContext, SelectedPlaylistContext } from '../../../context/playlistContext'
import Lottie from 'react-lottie';
import loadingSvg from '../../../stylesGlobaly/loading.json';
import ModalAdd from "./Modal"
import { openAddContext } from '../../../context/modalAddMusicContext';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import useMusic from '../../../hooks/useMusic'
import usePlaylist from '../../../hooks/usePlaylist'
import { filePlayingContext } from '../../../context/filePlaying'
import IconButton from '@material-ui/core/IconButton';

const Playlist = (props) => {
    const [selectedPlaylist, setSelectedPlaylist] = useContext(SelectedPlaylistContext)
    const [playlists, setPlaylists] = useContext(playlistsContext)
    const [videoFile, setVideoFile] = useContext(filePlayingContext)
    const [open, setOpen] = useState(false)
    const [clickedPlaylistId, setClickedPlaylistId] = useState('')
    const { handlerSetMusic, changeOrderMusic } = useMusic(
        [videoFile, setVideoFile],
        [playlists, setPlaylists],
        [selectedPlaylist, setSelectedPlaylist]
    )
    const { playlistsUser } = usePlaylist([playlists, setPlaylists])


    async function handlerAddMusics(idPlaylist) {
        setClickedPlaylistId(idPlaylist)
        setOpen(true)
    }

    async function onSortEnd({ oldIndex, newIndex }, playlistId) {
        const [playlistWhoChanged] = playlists.filter((playlist) => playlist._id == playlistId)
        changeOrderMusic(playlistWhoChanged, oldIndex, newIndex)
    }

    const SortableItem = SortableElement(({ value }) => {
        return <CardMusic>
            <MenuIconChangeMusic low_opacity={videoFile.playing} />
            <Text low_opacity={videoFile.value?._id != value.value?._id && videoFile.playing} as="center" size="14px" mb="0px" ml="12px" wrap="inherit" tlines={true}>{value.value?.title}</Text>
            <IconButton onClick={()=>handlerSetMusic(value.value)}>
                <PlayArrowIcon style={{ color: "#1db954" }}></PlayArrowIcon>
            </IconButton>
        </CardMusic>
    });

    const SortableList = SortableContainer(({ items }) => {
        return (
            <ul>
                {items.map((value, index) => (
                    <SortableItem disabled={videoFile.playing} key={`item-${value.value?._id}`} index={index} value={value} />
                ))}
            </ul>
        );
    });

    useEffect(() => {
        playlistsUser(props.user._id)
    }, [])


    return (
        <PlaylistContainer>
            {
                playlists.length == 0 && <Lottie
                    options={{
                        loop: true,
                        autoplay: true,
                        animationData: loadingSvg,
                        rendererSettings: {
                            preserveAspectRatio: "xMidYMid slice"
                        }
                    }}
                    height={40}
                    width={40}
                />
            }
            {
                playlists.map((element, i) => {
                    return (
                        <GridItemPlaylist key={element?._id} item xs={3}>
                            <CardPlaylist>
                                <Text size="16px" mb="0px">{element?.title}</Text>
                                <ContainerList>
                                    <SortableList items={element?.music} onSortEnd={(e) => onSortEnd(e, element?._id)} pressDelay={200} />
                                </ContainerList>
                                <div>
                                    <Button w="60%" my="1rem" onClick={() => handlerAddMusics(element?._id)}>Add Musicas</Button>
                                </div>
                            </CardPlaylist>
                        </GridItemPlaylist>
                    )
                })
            }
            <openAddContext.Provider value={[open, setOpen]}>
                <ModalAdd playlist={clickedPlaylistId} user={props.user} />
            </openAddContext.Provider>
        </PlaylistContainer>
    );
}

export default Playlist;