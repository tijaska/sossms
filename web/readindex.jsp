<%-- 
    This file is not part of the sossms system. It is used to preview index.md during development.
--%>

<%@page contentType="text/html" pageEncoding="UTF-8" import="java.io.BufferedReader,java.io.FileReader" %>
<!DOCTYPE html>
  <head>
    <meta charset="UTF-8">
	<title>sossms | Rescue</title>
    <link rel="stylesheet" href="/sossms/assets/css/style.css?v=374e6377f56b446a77f98d5fae1ad7ecd44505c9">
  </head>
  <body>
    <div class="container-lg px-3 my-5 markdown-body">
      <h1><a href="https://tijaska.github.io/sossms/">sossms preview</a></h1>
<%	// copy index.md here to be rendered as HTML:
//	String jspPath = session.getServletContext().getRealPath("/web");
//	out.println("jspPath=" + jspPath);
//	String source = jspPath + "/index.md";

out.println("test.jsp");

	int count = 0;
	try {
		BufferedReader reader = new BufferedReader(new FileReader("E:/b/websites/sossms/web/index.md"));
		String line = reader.readLine();
		while (line != null) {
			count++;
			if (count > 4)
				out.println(line);
			line = reader.readLine();
		}
		reader.close();
	} catch (Error err) {
		out.println("Error " + err.getLocalizedMessage());
	}
	out.println("Lines read = " + count);
%>
    </body>
</html>
