(() => {

    const serialize = params => {

        if ( typeof params === 'object' ) {

            let query = []
            for ( let param in params ) {
                if ( params.hasOwnProperty( param ) ) query.push( `${ encodeURI( param ) }=${ encodeURI( params[ param ] ) }` )
            }

            return query.join( '&' )

        }

        return null

    }

    const execute = ( type, url, data, encoding ) => {

        log.debug( '[request.js] url', url )
        log.debug( '[request.js] type', type )
        log.debug( '[request.js] data', data )
        log.debug( '[request.js] encoding', encoding )

        switch(type) {
            case 'POST':
                session.execute( 'curl', `${url} ${encoding} post ${data}` )
                break
            case 'GET': 
                url = data ? `${url}?${data}` : url
                session.execute( 'curl', url )
                break
            default:
                throw new Error('[request.js] execute() Missing required paramenter [type]')
        }

        return {
            code: parseInt(session.getVariable('curl_response_code')),
            data: session.getVariable('curl_response_data')
        }

    }


    const post = (url, data, encoding) => {
        
        if (!url) throw new Error('[request.js] Missing required POST paramenter [url]')
        
        encoding = encoding || 'application/x-www-form-urlencoded'
        encoding = `Content-type:${encoding}`

        if ( null !== data ) data = serialize( data )
        if ( encoding == 'Content-type:application/json' ) encoding = `json`

        return execute('POST', url, data, encoding)

    }

    const get = (url, data) => {
        
        if (!url) throw new Error('[request.js] Missing required GET paramenter [url]')

        data = null !== data ? serialize(data) : null

        return execute('GET', url, data)

    }


    return {
        post: post,
        get: get
    }

})()