(() => {

    const SOUNDS_SPELLABLE_PATH = `${session.getVariable('sounds_dir')}/luna/spellable`
    const SOUNDS_DEFAULT_PATH   = `${session.getVariable('sounds_dir')}/luna/default`
    const SOUNDS_SERVICE_PATH   = `${session.getVariable('sounds_dir')}/custom/services`

    const spellable = {
        '1': '1.wav',
        '2': '2.wav',
        '3': '3.wav',
        '4': '4.wav',
        '5': '5.wav',
        '6': '6.wav',
        '7': '7.wav',
        '8': '8.wav',
        '9': '9.wav',
        '0': '0.wav',
        'A': 'A.wav',
        'B': 'B.wav',
        'C': 'C.wav',
        'D': 'D.wav',
        'E': 'E.wav',
        'F': 'F.wav',
        'G': 'G.wav',
        'H': 'H.wav',
        'I': 'I.wav',
        'J': 'J.wav',
        'K': 'K.wav',
        'L': 'L.wav',
        'M': 'M.wav',
        'N': 'N.wav',
        'O': 'O.wav',
        'P': 'P.wav',
        'Q': 'Q.wav',
        'R': 'R.wav',
        'S': 'S.wav',
        'T': 'T.wav',
        'U': 'U.wav',
        'V': 'V.wav',
        'X': 'X.wav',
        'Y': 'Y.wav',
        'W': 'W.wav',
        'Z': 'Z.wav',
    }

    this.play = ( filename, s, path ) => {


        // try {

            if ( !filename ) throw new Error( 'Missing required argument filename' )

            s    = s || session
            path = path || this.getServiceSoundPath()

            let fullpath = `${ path }/${ filename }`

            if ( s.ready() ) {

                let fd = new FileIO( fullpath, 'r' )

                s.sleep( 500 )

                if ( fd ) s.execute( 'playback', fullpath )

            } else {
                throw new Error( 'Session not ready' )
            }

        // } catch ( err ) {
        //     log.error( '[media.js] play() ERROR', err )
        // }


    }

    this.spell = ( phrase, s ) => {

        if ( !phrase ) throw new Error( 'Missing required argument phrase' )

        s = s || session

        let chars = phrase.toString().split( '' )

        chars.forEach( char => {

            if ( spellable.hasOwnProperty( char.toUpperCase() ) ) {
                this.play( spellable[ char.toString().toUpperCase() ], s, SOUNDS_SPELLABLE_PATH )
            } else {
                log.notice( `Char '${ char }' not found in spellable list. Ignoring` )
            }

        } )

    }


    this.getServiceSoundPath = (s) => {
        s = s || session
        return `${ SOUNDS_SERVICE_PATH }/${ s.getVariable( 'inx_owner' ) }/${ s.getVariable( 'inx_service' ) }`
    }

    this.getDefaultSoundPath = () => SOUNDS_DEFAULT_PATH

    return this

})()