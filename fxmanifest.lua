fx_version 'bodacious'
game 'gta5'

author 'Zhincore'
version '0.1.0'

fxdk_watch_command 'yarn' {'watch'}
fxdk_build_command 'yarn' {'build'}

client_script 'dist/client.js'
server_script 'dist/server.js'

ui_page 'nui/index.html'

files {
    'nui/index.html',
    'dist/nui.js'
}
