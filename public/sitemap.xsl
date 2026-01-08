<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9">
<xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>

<xsl:template match="/">
<!--
© 2026 SDGP.lk
Licensed under the GNU Affero General Public License v3.0 or later,
with an additional restriction: Non-commercial use only.
See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
-->
<html lang="en">
<head>
    <title>SDGP.LK - XML Sitemap</title>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg,rgb(5, 11, 36) 0%,rgb(15, 15, 15) 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
            color: white;
            padding: 40px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
            font-weight: 700;
        }
        
        .header p {
            font-size: 1.1rem;
            opacity: 0.9;
        }
        
        .stats {
            background: #f8f9fa;
            padding: 20px 40px;
            border-bottom: 1px solid #e9ecef;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
        }
        
        .stat-item {
            text-align: center;
            margin: 10px;
        }
        
        .stat-number {
            font-size: 2rem;
            font-weight: bold;
            color: #3498db;
        }
        
        .stat-label {
            font-size: 0.9rem;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .content {
            padding: 40px;
        }
        
        .section {
            margin-bottom: 40px;
        }
        
        .section-title {
            font-size: 1.5rem;
            color: #2c3e50;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #3498db;
            display: inline-block;
        }
        
        .url-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 20px;
        }
        
        .url-card {
            background: #fff;
            border: 1px solid #e9ecef;
            border-radius: 10px;
            padding: 20px;
            transition: all 0.3s ease;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        
        .url-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 20px rgba(0,0,0,0.1);
            border-color: #3498db;
        }
        
        .url-link {
            color: #3498db;
            text-decoration: none;
            font-weight: 600;
            font-size: 1.1rem;
            display: block;
            margin-bottom: 10px;
            word-break: break-all;
        }
        
        .url-link:hover {
            color: #2980b9;
            text-decoration: underline;
        }
        
        .url-meta {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            font-size: 0.9rem;
        }
        
        .meta-item {
            display: flex;
            align-items: center;
            gap: 5px;
        }
        
        .meta-label {
            font-weight: 600;
            color: #666;
        }
        
        .meta-value {
            color: #333;
            padding: 2px 8px;
            background: #f8f9fa;
            border-radius: 4px;
        }
        
        .priority-high { background: #d4edda; color: #155724; }
        .priority-medium { background: #fff3cd; color: #856404; }
        .priority-low { background: #f8d7da; color: #721c24; }
        
        .footer {
            background: #2c3e50;
            color: white;
            text-align: center;
            padding: 20px;
            font-size: 0.9rem;
        }
        
        @media (max-width: 768px) {
            .header h1 { font-size: 2rem; }
            .stats { flex-direction: column; }
            .content { padding: 20px; }
            .url-grid { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🗺️ SDGP.LK Sitemap</h1>
            <p>Discover all pages and content on our platform</p>
        </div>
        
        <div class="stats">
            <div class="stat-item">
                <div class="stat-number"><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></div>
                <div class="stat-label">Total URLs</div>
            </div>
            <div class="stat-item">
                <div class="stat-number"><xsl:value-of select="count(sitemap:urlset/sitemap:url[sitemap:priority >= 0.8])"/></div>
                <div class="stat-label">High Priority</div>
            </div>
            <div class="stat-item">
                <div class="stat-number"><xsl:value-of select="count(sitemap:urlset/sitemap:url[sitemap:changefreq = 'daily'])"/></div>
                <div class="stat-label">Daily Updates</div>
            </div>
        </div>
        
        <div class="content">
            <div class="section">
                <h2 class="section-title">📄 All Pages</h2>
                <div class="url-grid">
                    <xsl:for-each select="sitemap:urlset/sitemap:url">
                        <xsl:sort select="sitemap:priority" order="descending"/>
                        <div class="url-card">
                            <a href="{sitemap:loc}" class="url-link" target="_blank">
                                <xsl:value-of select="sitemap:loc"/>
                            </a>
                            <div class="url-meta">
                                <div class="meta-item">
                                    <span class="meta-label">Priority:</span>
                                    <span class="meta-value">
                                        <xsl:attribute name="class">
                                            meta-value
                                            <xsl:choose>
                                                <xsl:when test="sitemap:priority >= 0.8">priority-high</xsl:when>
                                                <xsl:when test="sitemap:priority >= 0.6">priority-medium</xsl:when>
                                                <xsl:otherwise>priority-low</xsl:otherwise>
                                            </xsl:choose>
                                        </xsl:attribute>
                                        <xsl:value-of select="sitemap:priority"/>
                                    </span>
                                </div>
                                <div class="meta-item">
                                    <span class="meta-label">Update:</span>
                                    <span class="meta-value"><xsl:value-of select="sitemap:changefreq"/></span>
                                </div>
                                <xsl:if test="sitemap:lastmod">
                                    <div class="meta-item">
                                        <span class="meta-label">Last Modified:</span>
                                        <span class="meta-value"><xsl:value-of select="sitemap:lastmod"/></span>
                                    </div>
                                </xsl:if>
                            </div>
                        </div>
                    </xsl:for-each>
                </div>
            </div>
        </div>
        
        <div class="footer">
            <p>© 2026 SDGP.LK - Generated on <xsl:value-of select="sitemap:urlset/sitemap:url[1]/sitemap:lastmod"/></p>
        </div>
    </div>
</body>
</html>
</xsl:template>
</xsl:stylesheet>
