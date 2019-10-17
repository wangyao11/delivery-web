module.exports = {

  title: 'WEX 配送系统',

  /**
   * @type {boolean} true | false
   * @description Whether fix the header
   */
  fixedHeader: false,

  /**
   * @type {boolean} true | false
   * @description Whether show the logo in sidebar
   */
  sidebarLogo: false,

  imageUrl: process.env.VUE_APP_BASE_API + '/images/',

  imageUpload: process.env.VUE_APP_BASE_API + '/web/image/uploadImage'
}
