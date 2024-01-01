!macro customUnInstall
  SetShellVarContext current
  MessageBox MB_YESNO "Do you also want to delete all configuration data? This will delete your collection, settings and your song ratings. It is recommended to keep them if you plan to install Dopamine again later." \
    /SD IDNO IDNO Skipped IDYES Accepted

  Accepted:
    RMDir /r "$APPDATA\${APP_FILENAME}"
    !ifdef APP_PRODUCT_FILENAME
      RMDir /r "$APPDATA\${APP_PRODUCT_FILENAME}"
    !endif
    Goto done
  Skipped:
    Goto done
  done:
!macroend