Private Sub myOlItems_ItemAdd(ByVal Item As Object)

    MsgBox "add"

    update Item

End Sub

Private Sub myOlItems_ItemChange(ByVal Item As Object)

    'MsgBox "update"

    update Item

End Sub

 

Private Sub myOlItems_ItemRemove(ByVal Item As AppointmentItem)

    update Item

End Sub

 

Public Function update(ByVal Item As AppointmentItem)

    Dim objNS As Outlook.NameSpace

    Dim objAppointments As Outlook.Items

    Dim objCalendarFolder As Outlook.MAPIFolder

    Dim objAppointment As Outlook.AppointmentItem

    Dim appointments As String

    Dim sapId As String

   

    

    Set objNS = Application.GetNamespace("MAPI")

    Set objCalendarFolder = objNS.GetDefaultFolder(olFolderCalendar)

    Set objAppointments = objCalendarFolder.Items

           

    appointments = "["

    For Each objAppointment In objAppointments

        appointment = "{"

        appointment = appointment & """subject"":""" & Replace(objAppointment.Subject,"""","\""") & ""","

        appointment = appointment & """start"":""" & objAppointment.StartUTC & ""","

        appointment = appointment & """end"":""" & objAppointment.EndUTC & ""","

       

        appointment = appointment & """categories"":""" & objAppointment.Categories & """"

       

        

        appointment = appointment & "},"

        appointments = appointments & appointment

    Next

    appointments = Left(appointments, Len(appointments) - 1) & "]"

 

    sapId = "259"

 

    report = "{""sapId"":""" & sapId & """,""appointments"":" & appointments & "}"

 

    sendString report

   

    Set objNS = Nothing

    Set objAppointment = Nothing

    Set objAppointments = Nothing

    Set objCalendarFolder = Nothing

   

End Function

Public Function sendString(ByVal Item As String)
    ' MsgBox "update"
    Dim XMLHttp As Object
    Dim strURL As String, strMethod As String, strUser As String
    Dim strPassword As String
    Dim bolAsync As Boolean
    
    Set XMLHttp = CreateObject("MSXML2.XMLHTTP")
    
    strMethod = "POST"
    strURL = "https://raspberrypi.e6azumuvyiabvs9s.myfritz.net/tm/times/upload.php"
    bolAsync = False
    strUser = "*******"
    strPassword = "*********+"
    
    postMessage = Item
    
    ' MsgBox "POST-Request, der XML liefert senden mit " & postMessage
 
    ' Request absetzen
    Call XMLHttp.Open(strMethod, strURL, bolAsync, strUser, strPassword)
    Call XMLHttp.setRequestHeader("Content-Type", "application/json")
    Call XMLHttp.Send(postMessage)
 
    ' Rückgabewerte ausgeben
    MsgBox "Status: " & XMLHttp.Status & " responseText: " & (XMLHttp.responseText)
End Function

