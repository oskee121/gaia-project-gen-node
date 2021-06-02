export default function errorBody(error){
    return {
        success: false,
        error,
        timestamp: new Date().toJSON()
    }
}
