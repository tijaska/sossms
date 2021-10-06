package org.apache.jsp;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;
import java.io.BufferedReader;
import java.io.FileReader;

public final class readindex_jsp extends org.apache.jasper.runtime.HttpJspBase
    implements org.apache.jasper.runtime.JspSourceDependent {

  private static final JspFactory _jspxFactory = JspFactory.getDefaultFactory();

  private static java.util.List<String> _jspx_dependants;

  private org.glassfish.jsp.api.ResourceInjector _jspx_resourceInjector;

  public java.util.List<String> getDependants() {
    return _jspx_dependants;
  }

  public void _jspService(HttpServletRequest request, HttpServletResponse response)
        throws java.io.IOException, ServletException {

    PageContext pageContext = null;
    HttpSession session = null;
    ServletContext application = null;
    ServletConfig config = null;
    JspWriter out = null;
    Object page = this;
    JspWriter _jspx_out = null;
    PageContext _jspx_page_context = null;

    try {
      response.setContentType("text/html;charset=UTF-8");
      pageContext = _jspxFactory.getPageContext(this, request, response,
      			null, true, 8192, true);
      _jspx_page_context = pageContext;
      application = pageContext.getServletContext();
      config = pageContext.getServletConfig();
      session = pageContext.getSession();
      out = pageContext.getOut();
      _jspx_out = out;
      _jspx_resourceInjector = (org.glassfish.jsp.api.ResourceInjector) application.getAttribute("com.sun.appserv.jsp.resource.injector");

      out.write("\n");
      out.write("\n");
      out.write("\n");
      out.write("<!DOCTYPE html>\n");
      out.write("  <head>\n");
      out.write("    <meta charset=\"UTF-8\">\n");
      out.write("\t<title>sossms | Rescue</title>\n");
      out.write("    <link rel=\"stylesheet\" href=\"/sossms/assets/css/style.css?v=374e6377f56b446a77f98d5fae1ad7ecd44505c9\">\n");
      out.write("  </head>\n");
      out.write("  <body>\n");
      out.write("    <div class=\"container-lg px-3 my-5 markdown-body\">\n");
      out.write("      <h1><a href=\"https://tijaska.github.io/sossms/\">sossms preview</a></h1>\n");
	// copy index.md here to be rendered as HTML:
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

      out.write("\n");
      out.write("    </body>\n");
      out.write("</html>\n");
    } catch (Throwable t) {
      if (!(t instanceof SkipPageException)){
        out = _jspx_out;
        if (out != null && out.getBufferSize() != 0)
          out.clearBuffer();
        if (_jspx_page_context != null) _jspx_page_context.handlePageException(t);
        else throw new ServletException(t);
      }
    } finally {
      _jspxFactory.releasePageContext(_jspx_page_context);
    }
  }
}
