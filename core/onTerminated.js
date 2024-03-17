() => {

    log.info( '|------ CALL TERMINATED ------|' )
    
    if (session.uuid.length > 0) session.destroy()
    exit( 'End of Script' )

}