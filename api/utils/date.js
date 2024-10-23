export default {
    epochToDashedDate: epoch => 
        new Date(epoch * 1000).toISOString().replace(/T.*/, '').split('-').reverse().join('-')
}