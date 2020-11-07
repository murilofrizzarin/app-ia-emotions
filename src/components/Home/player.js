import React, { useState, useEffect, useContext, useMemo } from 'react';
import { PlayerAudio, TimeLine } from './style'
import { filePlayingContext } from '../../context/filePlaying'
import IconButton from '@material-ui/core/IconButton';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import usePlayer from '../../hooks/usePlayer'
import SkipNextIcon from '@material-ui/icons/SkipNext';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import { SelectedPlaylistContext } from '../../context/playlistContext'

const Player = (props) => {
    const [videoFile, setVideoFile] = useContext(filePlayingContext)
    const [selectedPlaylist, setSelectedPlaylist] = useContext(SelectedPlaylistContext)
    const { 
        PlayPause, 
        findMusicByNextBack
    } = usePlayer([videoFile, setVideoFile], [selectedPlaylist, setSelectedPlaylist]);
    
    const handleSeekMouseDown = e => {
        const newVideoFile = {...videoFile}
        newVideoFile.seeking = true
        console.log(newVideoFile.seeking)
        setVideoFile(newVideoFile)
    }

    const handleSeekChange = (value) => {
        const newVideoFile = {...videoFile}
        newVideoFile.played = parseFloat(value)
        setVideoFile(newVideoFile)
    }

    const handleSeekMouseUp = (value) => {
        const newVideoFile = {...videoFile}
        newVideoFile.seeking = false

        setVideoFile(newVideoFile)
        props.player.current.seekTo(parseFloat(value))
    }

    return (
        <PlayerAudio bottom={props.bottom} height={props.height}>
            <IconButton onClick={()=>{
                findMusicByNextBack(videoFile.back, selectedPlaylist.music.length-1)
            }}>
                <SkipPreviousIcon style={{ color: "#FFFFFF" }}></SkipPreviousIcon>
            </IconButton>
            <IconButton onClick={()=>{
                PlayPause(!videoFile.playing)
            }}>
                {!videoFile.playing ? <PlayArrowIcon style={{ color: "#FFFFFF" }}></PlayArrowIcon> : <PauseIcon style={{ color: "#FFFFFF" }}></PauseIcon>}
            </IconButton>
            <IconButton onClick={()=>{
                findMusicByNextBack(videoFile.next, 0)
            }}>
                <SkipNextIcon style={{ color: "#FFFFFF" }}></SkipNextIcon>
            </IconButton>
            <TimeLine
                type='range' min={0} max={0.999999} step='any'
                value={videoFile.value ? videoFile.played : 0.0}
                onMouseDown={handleSeekMouseDown}
                onChange={(e)=>handleSeekChange(e.target.value)}
                onMouseUp={(e)=>handleSeekMouseUp(e.target.value)}
            ></TimeLine>
        </PlayerAudio>
    )
}

export default Player;