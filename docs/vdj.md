VDJ Stuff:

# VDJ send os2l message for change of track on deck 1 and 2

keyboard init
os2l_button "pong" & deck master video_fx true SpoutSender & video_output off
& deck master effect_active "ableton link"
-----------------------------------------------------------

(repeat_start_instant 'rsiPulseCheck' 85ms & (deck 1 load_pulse ? nothing : (wait 500ms & deck 1 get_filepath & param_cast string & param_add '::[SONG1]' & param_cast & os2l_button)) & (deck 2 load_pulse ? nothing : (wait 500ms & deck 2 get_filepath & param_cast string & param_add '::[SONG2]' & param_cast & os2l_button)))
& (repeat_start_instant 'rsiPulseCheck2' 190ms & (deck 1 load_pulse ? nothing : (get_vdj_folder & param_add '::[VDJHOME]' & param_cast & os2l_button)) & (deck 2 load_pulse ? nothing : (get_vdj_folder & param_add '::[VDJHOME]' & param_cast & os2l_button)))
& (set 'activeDeck' `get_activeDeck` & repeat_start 'checkActiveDeck' 190ms & param_equal `get_var activeDeck` `get_activeDeck` ? nothing : set 'activeDeck' `get_activeDeck` & param_cast string & param_add '::[MASTER]' & os2l_button)

# 1-button1

(deck 1 get_filepath & param_cast string & param_add '::[SONG1]' & param_cast & os2l_button) & (deck 2 get_filepath & param_cast string & param_add '::[SONG2]' & param_cast & os2l_button) & (get_activeDeck & param_cast string & param_add '::[MASTER]' & os2l_button)

# no longer needed

& (repeat_start_instant 'songpos' 200ms & deck master get_time "total" "absolute" & param_cast string & param_add "|" & set_var absolutetotal & deck master get_time "total" "relative" & param_cast string &  param_add "|" & set_var relativetotal & deck master get_time "elapsed" "absolute" & param_cast string & set_var absoluteelapsed& param_add `get_var absolutetotal` `get_var relativetotal` & set_var total& param_add `get_var absoluteelapsed` `get_var total` & param_add "::[SONGPOS]" & os2l_button)

(deck 1 get_filepath & param_cast string & param_add '::[SONG1]' & param_cast & os2l_button) & (deck 2 get_filepath & param_cast string & param_add '::[SONG2]' & param_cast & os2l_button) & (get_activeDeck & param_cast string & param_add '::[MASTER]' & param_cast & os2l_button)

# TEST1

(
    repeat_start_instant 'rsiPulseCheck' 190ms
    & (deck 1 load_pulse ? nothing : deck 1 get_filepath & param_add `::1a` & param_cast & os2l_button)
    & (deck 2 load_pulse ? nothing : deck 2 get_filepath & param_add `::2a` & param_cast & os2l_button)
)

# TEST2

set 'activeDeck' `get_activeDeck` & repeat_start 'checkActiveDeck' 100ms & (param_equal `get_var activeDeck` `get_activeDeck` ? nothing : set 'activeDeck' `get_activeDeck` & param_cast string & param_add "::[MASTER]" & os2l_button)

# TEST 3

# Time & BeatPos COmbined every 100ms

repeat_start_instant 'beatpostime' 200ms & (((deck 1 get_time "elapsed" & param_cast string & param_add '|' & param_cast & set_var $time) & (deck 1 get_beatpos & param_cast string & set_var $beatpos)) & param_add `get_var $beatpos` `get_var $time` & param_add "::[BEATPOSTIME]" & debug)

repeat_start_instant 'songpos' 200ms & deck 1 get_time "elapsed" & param_cast string & param_add "::[SONGPOS]" & debug
repeat_start_instant 'songpos' 200ms & deck master get_time "elapsed" "absolute" & param_cast string & param_add "::[SONGPOS]" & os2l_button

deck master get_time "total" "absolute" & param_cast string & set_var absolutetotal & deck master get_time "total" "relative" & param_cast string & set_var relativetotal & debug
deck master get_pitch & param_cast string & debug

repeat_start_instant 'beatpostime' 200ms &
deck master get_time "total" "absolute" & param_cast string & param_add "|" & set_var absolutetotal
& deck master get_time "total" "relative" & param_cast string &  param_add "|" & set_var relativetotal
& deck master get_time "elapsed" "absolute" & param_cast string & set_var absoluteelapsed
& param_add `get_var absolutetotal` `get_var relativetotal` set_var total
& param_add `get_var absoluteelapsed` `get_var total` & param_add "::[SONGPOS]"
& os2l_button

repeat_stop "beatpostime"
repeat_start_instant 'songpos' 200ms & deck master get_time "total" "absolute" & param_cast string & param_add "|" & set_var absolutetotal & deck master get_time "total" "relative" & param_cast string &  param_add "|" & set_var relativetotal & deck master get_time "elapsed" "absolute" & param_cast string & set_var absoluteelapsed& param_add `get_var absolutetotal` `get_var relativetotal` & param_add "|" & set_var total& param_add `get_var absoluteelapsed` `get_var total` & param_add "::[SONGPOS]" & debug
