import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify)

export default new Vuetify({
  icons: {
    iconfont: 'mdi',
  },
  theme: {
    dark: true,
    themes: {
      light: {
        primary: colors.blue.darken3, // #E53935
        secondary: colors.indigo.lighten2, // #FFCDD2
        accent: colors.indigo.base, // #3F51B5
      },
      dark: {
        primary: '3560DF', // #E53935
        secondary: colors.indigo.lighten2, // #FFCDD2
        accent: colors.indigo.base, // #3F51B5
      },
    },
  },
})

