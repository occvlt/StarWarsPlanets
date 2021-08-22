import React, {useState, useEffect, useCallback, useMemo, useContext} from 'react';
import { ThemeContexts, themes } from '../contexts/theme-contexts';

const App = () => {
    const [id, setId] = useState(1)
    const [visible, setVisible] = useState(true)
    const [currentTheme, setCurrentThemes] = useState(themes.light)
    
    const toggleThemes = () => {
        setCurrentThemes((prevThemes) => {
            return prevThemes === themes.light ? themes.dark : themes.light
        })
    }

    if (visible) {
        return(
            <>
                <button onClick={() => setId(id + 1)}>+</button>
                <button onClick={() => {setVisible(false)}}>hide</button>
                <button onClick={toggleThemes}>{currentTheme === themes.light ? 'dark theme' : 'light theme'}</button>
                <ThemeContexts.Provider value={currentTheme}>
                    <PlanetInfo id={id}/>
                </ThemeContexts.Provider>
            </>
        )
    } else {    
        return(
            <button onClick={() => {setVisible(true)}}>hide</button> 
        )
    }
}

const getPlanet = (id) => {
    return fetch(`https://swapi.dev/api/planets/${id}/`)
        .then(res => res.json())
        .then(data => data) //[{}]
}

const useRequest = (request) => {
    const initialState = useMemo(() => ({
        data: null,
        loading: true,
        error: null
    }), [])

    const [name, setName] = useState(initialState)
    useEffect(() => {
        setName(initialState)
        let cancelled = false
        request()
            .then(data => !cancelled && setName({
                data,
                loading: false,
                error: null
            }))
            .catch(error => !cancelled && setName({
                data: null,
                loading: false,
                error
            }))
        return () => {cancelled = true}
    }, [request, initialState])
    return name
}

const usePlanetInfo = (id) => {
    const request = useCallback(() => getPlanet(id), [id]);    
    return useRequest(request);
} 

const PlanetInfo = ({id}) => {
    const theme = useContext(ThemeContexts);
    const {data, loading, error} = usePlanetInfo(id)

    if (loading) {
        return <div>loading...</div>
    }

    if (error) {
        return <div>error...</div>
    }

    return(
        <div style={{backgroundColor: theme.backgroundColor, color: theme.color}}>{id} - {data.name}</div>
    )
}

export default App;