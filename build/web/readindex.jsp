<%-- 
    This file is not part of the sossms system. It is used to preview index.md during development.
--%>

<%@page contentType="text/html" pageEncoding="UTF-8" import="java.io.BufferedReader,java.io.FileReader" %>
<!DOCTYPE html>
  <head>
    <meta charset="UTF-8">
	<title>sossms | Rescue</title>
  </head>
  <body>
      <h1><a href="https://tijaska.github.io/sossms/">sossms preview</a></h1>
<%	// copy index.md here to be rendered as HTML:
//	String path = HttpServletRequest.getContextPath();
	try {
		BufferedReader reader = new BufferedReader(new FileReader("E:/b/websites/sossms/index.md"));
		String line = reader.readLine();
		while (line != null) {
			out.println(line.replaceAll("web/images/", "images/"));
			line = reader.readLine();
		}
		reader.close();
	} catch (Error err) {
		out.println("Error " + err.getLocalizedMessage());
	}
%>
    </body>
</html>
