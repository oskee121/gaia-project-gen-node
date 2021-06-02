export default function successBody(data){
    return {
        success: true,
        data,
        timestamp: new Date().toJSON()
    }
}
