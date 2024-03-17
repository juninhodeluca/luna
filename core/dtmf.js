(() => {

   

    const menu = params => {

        if ( !params.onPrompt ) throw new Error( 'Missing required argument params.onPrompt' )

        let onPrompt             = params.onPrompt                      // Required. The file to be played in the start
        let minLength            = 1                                    // Min length of digit to be valid
        let maxLength            = 1                                    // Max length of digit to be valid
        let maxAttempts          = params.maxAttempts          || 3     // Max attempts allowed if digit error
        let regex                = params.regex                || null  // Validation
        let digitTimeout         = params.digitTimeout         || 4000  // Interdigit timeout
        let absoluteTimeout      = params.absoluteTimeout      || 60000 // Total time while listener is active
        let onError              = params.onError              || null  // File sound to be played when invalid digit
        let onMaxAttemptsReached = params.onMaxAttemptsReached || null  // File sound to be played if all attempts are done

        const regExpString = regex ? `^${ regex }{${ minLength },${ maxLength }}$` : `^\w{${ minLength },${ maxLength }}$`
        const regexObject  = new RegExp( regExpString, 'g' )
 
        let attempt = 0
        let maxAttemptsReached = false
        let exitFromCallback = false
        let digit = ''

        const onInput = ( session, type, data, args ) => {

            if ( type == 'dtmf' ) {


                log.info(`[dtmf.js] DTMF digit catched ${ data.digit }`)

                /**
                 * Invalid digit catched. exit the callback and restart the
                 * listener if there's more attempts
                 */
                 if ( !data.digit.match( regex ) ) {
                    exitFromCallback = true
                    digit = ''
                    return false
                }

                digit += data.digit
                return args

            }

        }

        while ( attempt < maxAttempts ) {

            /**
             * When in the last attempt will avoid to repeat the message error,
             * because it usually became with an 'Invalid number. Try again'.
             */
            if ( attempt == maxAttempts - 1 ) {

                /**
                 * The next error should trigger the onMaxAttemptsReached file
                 * sound if exists or nothing.
                 */
                maxAttemptsReached = true
                onError = null

            }

            /**
             * Prompt the file sound.
             * After the first digit, will exit from the onInput callback
             * triggered by the session.streamFile and will enter in the
             * onInput callback triggered by session.collectInput.
             * 
             * In pratice, stop the play from session.streamFile, but still
             * listening for DTMF digits
             */
            session.streamFile( `${ media.getServiceSoundPath() }/${ onPrompt }`, onInput, false )
            if ( !exitFromCallback ) session.collectInput( onInput, true, digitTimeout, absoluteTimeout )


            /**
             * Stop the DTMF listener and return the digit if the user
             * input was all OK
             */
             if ( digit.match( regexObject ) ) break


            /**
             * User input was invalid, so reset the digit and play
             * the message error if exists.
             */
            if ( 
                !digit.length > 0 && 
                !maxAttemptsReached
            ) {
                    digit = ''
                    if (onError) {
                        media.play(onError)
                        session.sleep(750)
                    }
            }


            /**
             * Too many attempts. So, reset the digit value, play the
             * onMaxAttemptsReached file sound if exists and stop the execution
             * of the DTMF listener
             */
            if ( maxAttemptsReached ) {
                digit = ''
                if ( onMaxAttemptsReached ) {
                    media.play(onMaxAttemptsReached)
                    session.sleep(750)
                }
                break
            }

            attempt++

        }

        return digit

    }

    
    const collect = params => {


        if ( !params.onPrompt ) throw new Error( 'Missing required argument params.onPrompt' )

        let onPrompt             = params.onPrompt                      // Required. The file to be played in the start
        let minLength            = params.minLength            || 3     // Min length of digit collection to be valid
        let maxLength            = params.maxLength            || 15    // Max length of digit collection to be valid
        let maxAttempts          = params.maxAttempts          || 3     // Max attempts allowed if digit error
        let terminators          = params.terminators          || []    // Digit to destroy the dtmf listener
        let regex                = params.regex                || null  // Validation
        let digitTimeout         = params.digitTimeout         || 4000  // Interdigit timeout
        let absoluteTimeout      = params.absoluteTimeout      || 60000 // Total time while listener is active
        let onError              = params.onError              || null  // File sound to be played when invalid digit
        let onMaxAttemptsReached = params.onMaxAttemptsReached || null  // File sound to be played if all attempts are done

        const regExpString = regex ? `^${ regex }{${ minLength },${ maxLength }}$` : `^\w{${ minLength },${ maxLength }}$`
        const regexObject  = new RegExp( regExpString, 'g' )

        let attempt = 0
        let maxAttemptsReached = false
        let exitFromCallback = false
        let collectedDigits = ''

        const onInput = ( session, type, data, args ) => {

            if ( type == 'dtmf' ) {


                log.info(`[dtmf.js] DTMF digit catched ${ data.digit }`)


                /**
                 * If the user input was a terminator digit, so exit from
                 * callback, evaluate the collection and finish the listener
                 */
                if ( terminators.includes( data.digit ) ) {
                    exitFromCallback = true
                    onTerminator     = true
                    return collectedDigits
                }


                /**
                 * If the collection reaches the max length, so exit from
                 * callback and evaluate the collection
                 */
                if ( collectedDigits.length >= maxLength ) {
                    exitFromCallback = true
                    return collectedDigits
                }


                /**
                 * Invalid digit catched. exit the callback and restart the
                 * listener if there's more attempts
                 */
                if ( !data.digit.match( regex ) ) {
                    exitFromCallback = true
                    collectedDigits = ''
                    return false
                }

                collectedDigits += data.digit
                return args

            }

        }

        while ( attempt < maxAttempts ) {

            /**
             * When in the last attempt will avoid to repeat the message error,
             * because it usually became with an 'Invalid number. Try again'.
             */
            if ( attempt == maxAttempts - 1 ) {

                /**
                 * The next error should trigger the onMaxAttemptsReached file
                 * sound if exists or nothing.
                 */
                maxAttemptsReached = true
                onError = null

            }

            onTerminator = false // Flag to avoid the while loop to restart
            
            /**
             * This flag is part of FreeSWITCH workaround to collect DTMF digits
             * and stop the execution of file
             */
            exitFromCallback = false

            /**
             * Prompt the file sound.
             * After the first digit, will exit from the onInput callback
             * triggered by the session.streamFile and will enter in the
             * onInput callback triggered by session.collectInput.
             * 
             * In pratice, stop the play from session.streamFile, but still
             * listening for DTMF digits
             */
            session.streamFile( `${ media.getServiceSoundPath() }/${ onPrompt }`, onInput, false )
            if ( !exitFromCallback ) session.collectInput( onInput, true, digitTimeout, absoluteTimeout )
            

            /**
             * Stop the DTMF listener and return the collection if the user
             * input was a terminator digit
             */
            if ( onTerminator ) break


            /**
             * Stop the DTMF listener and return the collection if the user
             * input was all OK
             */
            if ( collectedDigits.match( regexObject ) ) break


            /**
             * User input was too small, so reset the collection and play
             * the message error if exists.
             */
            if (
                collectedDigits.length < minLength &&
                !maxAttemptsReached
            ) {
                    collectedDigits = ''
                    if (onError) {
                        media.play(onError)
                        session.sleep(750)
                    }
            }


            /**
             * Too many attempts. So, reset the collection, play the
             * onMaxAttemptsReached file sound if exists and stop the execution
             * of the DTMF listener
             */
            if ( maxAttemptsReached ) {
                collectedDigits = ''
                if ( onMaxAttemptsReached ) {
                    media.play(onMaxAttemptsReached)
                    session.sleep(750)
                }
                break
            }

            attempt++

        }

        return collectedDigits

    }

    return {
        menu: menu,
        collect: collect
    }

})()